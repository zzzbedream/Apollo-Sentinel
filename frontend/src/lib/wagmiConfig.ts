import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

const localRpcUrl = process.env.NEXT_PUBLIC_LOCAL_RPC_URL || "http://127.0.0.1:8545";
const testnetRpcUrl =
  process.env.NEXT_PUBLIC_TESTNET_RPC_URL ||
  process.env.NEXT_PUBLIC_RPC_URL ||
  "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";

const testnetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111");
const testnetName = process.env.NEXT_PUBLIC_TESTNET_NAME || (testnetChainId === 133 ? "HashKey Testnet" : "Sepolia");
const testnetSymbol = process.env.NEXT_PUBLIC_NATIVE_SYMBOL || (testnetChainId === 133 ? "HSK" : "ETH");
const explorerUrl =
  process.env.NEXT_PUBLIC_EXPLORER_URL ||
  (testnetChainId === 133 ? "https://hashkey.blockscout.com" : "https://sepolia.etherscan.io");

export const hardhatLocal = defineChain({
  id: 31337,
  name: "Hardhat Local",
  network: "hardhat-local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: [localRpcUrl] },
  },
});

export const testnetChain = defineChain({
  id: testnetChainId,
  name: testnetName,
  network: "testnet",
  nativeCurrency: {
    decimals: 18,
    name: testnetSymbol,
    symbol: testnetSymbol,
  },
  rpcUrls: {
    default: { http: [testnetRpcUrl] },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: explorerUrl,
    },
  },
});

export const config = createConfig({
  chains: [hardhatLocal, testnetChain],
  connectors: [injected()],
  transports: {
    [hardhatLocal.id]: http(localRpcUrl),
    [testnetChain.id]: http(testnetRpcUrl),
  },
});
