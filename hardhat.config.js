require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const TESTNET_RPC_URL = process.env.TESTNET_RPC_URL || "";
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const inferredSepolia = /sepolia/i.test(TESTNET_RPC_URL);

const TESTNET_CHAIN_ID = process.env.TESTNET_CHAIN_ID
  ? Number(process.env.TESTNET_CHAIN_ID)
  : inferredSepolia
    ? 11155111
    : undefined;

const normalizedDeployerKey = DEPLOYER_PRIVATE_KEY
  ? (DEPLOYER_PRIVATE_KEY.startsWith("0x") ? DEPLOYER_PRIVATE_KEY : `0x${DEPLOYER_PRIVATE_KEY}`)
  : "";

const explorerApiUrl = process.env.TESTNET_EXPLORER_API_URL || (inferredSepolia ? "https://api-sepolia.etherscan.io/api" : "");
const explorerBrowserUrl = process.env.TESTNET_EXPLORER_BROWSER_URL || (inferredSepolia ? "https://sepolia.etherscan.io" : "");

const customChains =
  TESTNET_CHAIN_ID && explorerApiUrl && explorerBrowserUrl
    ? [
        {
          network: "testnet",
          chainId: TESTNET_CHAIN_ID,
          urls: {
            apiURL: explorerApiUrl,
            browserURL: explorerBrowserUrl,
          },
        },
      ]
    : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    testnet: {
      url: TESTNET_RPC_URL,
      accounts: normalizedDeployerKey ? [normalizedDeployerKey] : [],
      ...(TESTNET_CHAIN_ID ? { chainId: TESTNET_CHAIN_ID } : {})
    }
  },
  etherscan: {
    apiKey: {
      testnet: process.env.TESTNET_EXPLORER_API_KEY || process.env.ETHERSCAN_API_KEY || "",
    },
    customChains,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
