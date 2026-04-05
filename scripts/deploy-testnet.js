const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

function normalizePrivateKey(value) {
  if (!value) {
    return "";
  }
  return value.startsWith("0x") ? value : `0x${value}`;
}

async function verifyContract(address, constructorArguments = []) {
  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments,
    });
    console.log(`   Verified: ${address}`);
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    if (message.toLowerCase().includes("already verified")) {
      console.log(`   Already verified: ${address}`);
      return;
    }
    console.log(`   Verification skipped for ${address}: ${message}`);
  }
}

async function main() {
  console.log("Deploying Apollo contracts to testnet...\n");

  const [deployer] = await hre.ethers.getSigners();
  const backendSignerKey = normalizePrivateKey(process.env.BACKEND_SIGNER_PRIVATE_KEY || "");

  const aiOracleAddress = backendSignerKey
    ? new hre.ethers.Wallet(backendSignerKey).address
    : deployer.address;

  const networkInfo = await hre.ethers.provider.getNetwork();

  console.log("Network:", hre.network.name);
  console.log("Chain ID:", networkInfo.chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("AI Oracle:", aiOracleAddress);
  console.log("");

  console.log("1. Deploying MockUSDT...");
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();
  const mockUSDTAddress = await mockUSDT.getAddress();
  console.log("   MockUSDT:", mockUSDTAddress);

  console.log("\n2. Deploying ApolloZKID...");
  const ApolloZKID = await hre.ethers.getContractFactory("ApolloZKID");
  const apolloZKID = await ApolloZKID.deploy();
  await apolloZKID.waitForDeployment();
  const apolloZKIDAddress = await apolloZKID.getAddress();
  console.log("   ApolloZKID:", apolloZKIDAddress);

  console.log("\n3. Deploying ApolloSentinel...");
  const ApolloSentinel = await hre.ethers.getContractFactory("ApolloSentinel");
  const apolloSentinel = await ApolloSentinel.deploy(
    mockUSDTAddress,
    apolloZKIDAddress,
    aiOracleAddress
  );
  await apolloSentinel.waitForDeployment();
  const apolloSentinelAddress = await apolloSentinel.getAddress();
  console.log("   ApolloSentinel:", apolloSentinelAddress);

  const deploymentRecord = {
    network: hre.network.name,
    chainId: networkInfo.chainId.toString(),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    backendSigner: aiOracleAddress,
    contracts: {
      CONTRACT_ADDRESS_MOCK_USDT: mockUSDTAddress,
      CONTRACT_ADDRESS_ZKID: apolloZKIDAddress,
      CONTRACT_ADDRESS_APOLLO_SENTINEL: apolloSentinelAddress,
    },
  };

  const outputPath = path.join(__dirname, "..", "deployed-addresses.json");
  const previous = fs.existsSync(outputPath)
    ? JSON.parse(fs.readFileSync(outputPath, "utf8"))
    : {};

  previous[hre.network.name] = deploymentRecord;
  fs.writeFileSync(outputPath, JSON.stringify(previous, null, 2));

  console.log("\nSaved deployment data to deployed-addresses.json");

  const isLocalNetwork = hre.network.name === "localhost" || hre.network.name === "hardhat";
  const hasExplorerKey = Boolean(process.env.ETHERSCAN_API_KEY || process.env.TESTNET_EXPLORER_API_KEY);

  if (!isLocalNetwork && hasExplorerKey) {
    console.log("\n4. Attempting contract verification...");
    await verifyContract(mockUSDTAddress, []);
    await verifyContract(apolloZKIDAddress, []);
    await verifyContract(apolloSentinelAddress, [mockUSDTAddress, apolloZKIDAddress, aiOracleAddress]);
  } else {
    console.log("\n4. Verification skipped (local network or missing explorer API key).");
  }

  console.log("\nDeployment summary:");
  console.log("CONTRACT_ADDRESS_MOCK_USDT=", mockUSDTAddress);
  console.log("CONTRACT_ADDRESS_ZKID=", apolloZKIDAddress);
  console.log("CONTRACT_ADDRESS_APOLLO_SENTINEL=", apolloSentinelAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
