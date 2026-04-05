import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

const testnetRpcUrl =
  process.env.NEXT_PUBLIC_TESTNET_RPC_URL ||
  "https://testnet.hsk.xyz";

const testnetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "133");
const testnetName = process.env.NEXT_PUBLIC_TESTNET_NAME || "HashKey Testnet";
const testnetSymbol = process.env.NEXT_PUBLIC_NATIVE_SYMBOL || "HSK";
const explorerUrl =
  process.env.NEXT_PUBLIC_EXPLORER_URL || "https://testnet-explorer.hsk.xyz";

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
  chains: [testnetChain],
  connectors: [injected()],
  transports: {
    [testnetChain.id]: http(testnetRpcUrl),
  },
});
