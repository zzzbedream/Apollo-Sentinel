const hre = require("hardhat");

function normalizePrivateKey(value) {
  if (!value) {
    return "";
  }
  return value.startsWith("0x") ? value : `0x${value}`;
}

async function main() {
  console.log("Deploying Apollo Protocol contracts...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log("");

  // 1. Deploy MockUSDT
  console.log("1. Deploying MockUSDT...");
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();
  const usdtAddress = await mockUSDT.getAddress();
  console.log("   MockUSDT deployed to:", usdtAddress);

  // 2. Deploy ApolloZKID
  console.log("\n2. Deploying ApolloZKID...");
  const ApolloZKID = await hre.ethers.getContractFactory("ApolloZKID");
  const apolloZKID = await ApolloZKID.deploy();
  await apolloZKID.waitForDeployment();
  const zkidAddress = await apolloZKID.getAddress();
  console.log("   ApolloZKID deployed to:", zkidAddress);

  // 3. Deploy ApolloSentinel
  // Use backend signer if provided, otherwise fallback to deployer.
  const backendSignerKey = normalizePrivateKey(process.env.BACKEND_SIGNER_PRIVATE_KEY || "");
  const AI_ORACLE_ADDRESS = backendSignerKey
    ? new hre.ethers.Wallet(backendSignerKey).address
    : deployer.address;

  console.log("\n3. Deploying ApolloSentinel...");
  console.log("   AI Oracle Address:", AI_ORACLE_ADDRESS);

  const ApolloSentinel = await hre.ethers.getContractFactory("ApolloSentinel");
  const apolloSentinel = await ApolloSentinel.deploy(
    usdtAddress,
    zkidAddress,
    AI_ORACLE_ADDRESS
  );
  await apolloSentinel.waitForDeployment();
  const sentinelAddress = await apolloSentinel.getAddress();
  console.log("   ApolloSentinel deployed to:", sentinelAddress);

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("DEPLOYMENT COMPLETE!");
  console.log("=".repeat(50));
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log(`MockUSDT:       ${usdtAddress}`);
  console.log(`ApolloZKID:     ${zkidAddress}`);
  console.log(`ApolloSentinel: ${sentinelAddress}`);
  console.log(`AI Oracle:      ${AI_ORACLE_ADDRESS}`);
  console.log("\nAdd these to your .env file:");
  console.log(`CONTRACT_ADDRESS_MOCK_USDT=${usdtAddress}`);
  console.log(`CONTRACT_ADDRESS_ZKID=${zkidAddress}`);
  console.log(`CONTRACT_ADDRESS_APOLLO_SENTINEL=${sentinelAddress}`);

  return {
    mockUSDT: usdtAddress,
    apolloZKID: zkidAddress,
    apolloSentinel: sentinelAddress,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
