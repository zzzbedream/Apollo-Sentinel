const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Apollo Protocol", function () {
  let mockUSDT;
  let apolloZKID;
  let apolloSentinel;
  let owner;
  let aiOracle;
  let user1;
  let user2;
  let liquidityProvider;

  const USDT_DECIMALS = 6;
  const toUSDT = (amount) => ethers.parseUnits(amount.toString(), USDT_DECIMALS);

  beforeEach(async function () {
    // Get signers
    [owner, aiOracle, user1, user2, liquidityProvider] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDT.deploy();
    await mockUSDT.waitForDeployment();

    // Deploy ApolloZKID
    const ApolloZKID = await ethers.getContractFactory("ApolloZKID");
    apolloZKID = await ApolloZKID.deploy();
    await apolloZKID.waitForDeployment();

    // Deploy ApolloSentinel
    const ApolloSentinel = await ethers.getContractFactory("ApolloSentinel");
    apolloSentinel = await ApolloSentinel.deploy(
      await mockUSDT.getAddress(),
      await apolloZKID.getAddress(),
      aiOracle.address
    );
    await apolloSentinel.waitForDeployment();

    // Setup: Give liquidity provider some USDT
    await mockUSDT.mint(liquidityProvider.address, toUSDT(100000));
  });

  describe("ApolloZKID - Soulbound Token", function () {
    it("Should mint ZKID to a user", async function () {
      await apolloZKID.mintZKID(user1.address);
      expect(await apolloZKID.verifyZKID(user1.address)).to.be.true;
      expect(await apolloZKID.hasZKID(user1.address)).to.be.true;
    });

    it("Should not allow duplicate ZKID minting", async function () {
      await apolloZKID.mintZKID(user1.address);
      await expect(apolloZKID.mintZKID(user1.address))
        .to.be.revertedWith("ApolloZKID: Address already has a ZKID");
    });

    it("Should only allow owner to mint", async function () {
      await expect(apolloZKID.connect(user1).mintZKID(user2.address))
        .to.be.revertedWithCustomError(apolloZKID, "OwnableUnauthorizedAccount");
    });

    it("Should not allow transfers (Soulbound)", async function () {
      await apolloZKID.mintZKID(user1.address);
      const tokenId = await apolloZKID.getTokenId(user1.address);

      await expect(
        apolloZKID.connect(user1).transferFrom(user1.address, user2.address, tokenId)
      ).to.be.revertedWith("ApolloZKID: Soulbound tokens cannot be transferred");
    });

    it("Should not allow approvals", async function () {
      await apolloZKID.mintZKID(user1.address);
      const tokenId = await apolloZKID.getTokenId(user1.address);

      await expect(apolloZKID.connect(user1).approve(user2.address, tokenId))
        .to.be.revertedWith("ApolloZKID: Soulbound tokens cannot be approved");
    });

    it("Should return correct tokenURI", async function () {
      await apolloZKID.mintZKID(user1.address);
      const tokenId = await apolloZKID.getTokenId(user1.address);
      const uri = await apolloZKID.tokenURI(tokenId);
      expect(uri).to.include("data:application/json;base64,");
    });
  });

  describe("MockUSDT", function () {
    it("Should have correct decimals", async function () {
      expect(await mockUSDT.decimals()).to.equal(6);
    });

    it("Should allow faucet claims", async function () {
      await mockUSDT.connect(user1).faucet();
      const balance = await mockUSDT.balanceOf(user1.address);
      expect(balance).to.equal(toUSDT(1000));
    });

    it("Should enforce faucet cooldown", async function () {
      await mockUSDT.connect(user1).faucet();
      await expect(mockUSDT.connect(user1).faucet())
        .to.be.revertedWith("MockUSDT: Faucet cooldown not expired");
    });
  });

  describe("ApolloSentinel - Rescue Vault", function () {
    beforeEach(async function () {
      // Liquidity provider deposits into vault
      await mockUSDT.connect(liquidityProvider).approve(
        await apolloSentinel.getAddress(),
        toUSDT(50000)
      );
      await apolloSentinel.connect(liquidityProvider).deposit(toUSDT(50000));
    });

    it("Should accept liquidity deposits", async function () {
      expect(await apolloSentinel.totalLiquidity()).to.equal(toUSDT(50000));
      expect(await apolloSentinel.providerBalances(liquidityProvider.address))
        .to.equal(toUSDT(50000));
    });

    it("Should allow liquidity withdrawals", async function () {
      await apolloSentinel.connect(liquidityProvider).withdraw(toUSDT(20000));
      expect(await apolloSentinel.totalLiquidity()).to.equal(toUSDT(30000));
    });

    it("Should only allow AI Oracle to call executeDecision", async function () {
      await expect(
        apolloSentinel.connect(user1).executeDecision(user1.address, true, toUSDT(1000))
      ).to.be.revertedWithCustomError(apolloSentinel, "OnlyAIOracle");
    });

    it("Should emit JIT_RescueExecuted when user has ZKID", async function () {
      // Mint ZKID to user1
      await apolloZKID.mintZKID(user1.address);

      // Execute rescue decision
      await expect(
        apolloSentinel.connect(aiOracle).executeDecision(user1.address, true, toUSDT(5000))
      ).to.emit(apolloSentinel, "JIT_RescueExecuted");
    });

    it("Should emit SurgicalLiquidation when user has no ZKID but rescue requested", async function () {
      // user2 has no ZKID
      await expect(
        apolloSentinel.connect(aiOracle).executeDecision(user2.address, true, toUSDT(5000))
      ).to.emit(apolloSentinel, "SurgicalLiquidation");
    });

    it("Should emit SurgicalLiquidation when isRescue is false", async function () {
      // Even if user has ZKID, if isRescue is false, liquidate
      await apolloZKID.mintZKID(user1.address);

      await expect(
        apolloSentinel.connect(aiOracle).executeDecision(user1.address, false, toUSDT(5000))
      ).to.emit(apolloSentinel, "SurgicalLiquidation");
    });

    it("Should track rescue and liquidation stats", async function () {
      await apolloZKID.mintZKID(user1.address);

      // Execute a rescue
      await apolloSentinel.connect(aiOracle).executeDecision(user1.address, true, toUSDT(5000));

      // Execute a liquidation
      await apolloSentinel.connect(aiOracle).executeDecision(user2.address, false, toUSDT(3000));

      const stats = await apolloSentinel.getVaultStats();
      expect(stats._totalRescues).to.equal(1);
      expect(stats._totalLiquidations).to.equal(1);
      expect(stats._totalRescueAmount).to.equal(toUSDT(5000));
      expect(stats._totalLiquidationAmount).to.equal(toUSDT(3000));
    });

    it("Should check if user would be rescued", async function () {
      await apolloZKID.mintZKID(user1.address);

      expect(await apolloSentinel.wouldBeRescued(user1.address)).to.be.true;
      expect(await apolloSentinel.wouldBeRescued(user2.address)).to.be.false;
    });

    it("Should allow owner to update AI Oracle", async function () {
      const newOracle = user2.address;
      await apolloSentinel.setAIOracle(newOracle);
      expect(await apolloSentinel.aiOracle()).to.equal(newOracle);
    });
  });
});
