/**
 * sync-env-addresses.js
 * 
 * Reads deployed-addresses.json and updates .env and frontend/.env.local
 * with the contract addresses.
 * 
 * Usage: node scripts/sync-env-addresses.js [network]
 * Default network: testnet
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const DEPLOYED_ADDRESSES_FILE = path.join(ROOT_DIR, "deployed-addresses.json");
const ROOT_ENV_FILE = path.join(ROOT_DIR, ".env");
const FRONTEND_ENV_FILE = path.join(ROOT_DIR, "frontend", ".env.local");

function updateEnvFile(filePath, updates) {
  let content = "";
  
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, "utf8");
  }

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    const newLine = `${key}=${value}`;
    
    if (regex.test(content)) {
      content = content.replace(regex, newLine);
    } else {
      content += (content.endsWith("\n") || content === "" ? "" : "\n") + newLine + "\n";
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filePath}`);
}

function main() {
  const network = process.argv[2] || "testnet";

  if (!fs.existsSync(DEPLOYED_ADDRESSES_FILE)) {
    console.error("Error: deployed-addresses.json not found.");
    console.error("Run 'npm run deploy:testnet' first.");
    process.exit(1);
  }

  const deployedData = JSON.parse(fs.readFileSync(DEPLOYED_ADDRESSES_FILE, "utf8"));
  const networkData = deployedData[network];

  if (!networkData) {
    console.error(`Error: No deployment found for network '${network}'`);
    console.error(`Available networks: ${Object.keys(deployedData).join(", ")}`);
    process.exit(1);
  }

  const contracts = networkData.contracts;

  console.log(`\nSyncing addresses from '${network}' deployment...\n`);
  console.log("Contracts:");
  console.log(`  MockUSDT:       ${contracts.CONTRACT_ADDRESS_MOCK_USDT}`);
  console.log(`  ApolloZKID:     ${contracts.CONTRACT_ADDRESS_ZKID}`);
  console.log(`  ApolloSentinel: ${contracts.CONTRACT_ADDRESS_APOLLO_SENTINEL}`);
  console.log("");

  // Update root .env
  updateEnvFile(ROOT_ENV_FILE, {
    CONTRACT_ADDRESS_MOCK_USDT: contracts.CONTRACT_ADDRESS_MOCK_USDT,
    CONTRACT_ADDRESS_ZKID: contracts.CONTRACT_ADDRESS_ZKID,
    CONTRACT_ADDRESS_APOLLO_SENTINEL: contracts.CONTRACT_ADDRESS_APOLLO_SENTINEL,
  });

  // Update frontend/.env.local
  updateEnvFile(FRONTEND_ENV_FILE, {
    NEXT_PUBLIC_USDT_ADDRESS: contracts.CONTRACT_ADDRESS_MOCK_USDT,
    NEXT_PUBLIC_ZKID_ADDRESS: contracts.CONTRACT_ADDRESS_ZKID,
    NEXT_PUBLIC_SENTINEL_ADDRESS: contracts.CONTRACT_ADDRESS_APOLLO_SENTINEL,
  });

  console.log("\n✅ Environment files synced successfully!");
  console.log("\nNext steps:");
  console.log("1. cd frontend && npm run dev");
  console.log("2. Test: curl -X POST http://localhost:3000/api/evaluate-risk ...");
}

main();
