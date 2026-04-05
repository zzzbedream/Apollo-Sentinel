<div align="center">

# 🛡️ APOLLO Sentinel

### **AI-Powered DeFi Protection Layer for HashKey Chain**

*Stop Punishing Users. Start Protecting Them.*

[![HashKey Chain](https://img.shields.io/badge/HashKey_Chain-Testnet-00dbe7?style=for-the-badge)](https://hashkey.com)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**🏆 Built for HashKey On-Chain Horizon Hackathon 2026**

[Launch Demo](https://apollo-sentinel.vercel.app) · [Smart Contracts](#-deployed-contracts) · [Architecture](#-architecture)

</div>

---

## 🎯 The Problem

Traditional DeFi liquidations are **extractive by design**:

| Issue | Impact |
|-------|--------|
| 🔴 **Blind 50% Liquidations** | Arbitrary seizure of half your collateral regardless of actual debt |
| 🔴 **MEV Bot Front-running** | Bots profit while users suffer permanent capital loss |
| 🔴 **Zero User Protection** | No consideration for user history or creditworthiness |

## 💡 Our Solution

**APOLLO Sentinel** is the first AI-driven liquidation protection layer on HashKey Chain. We replace destructive liquidations with **surgical Just-In-Time (JIT) rescues**.

### Core Innovation

```
Traditional DeFi:  Health Factor < 1.0  →  50% Liquidation  →  User loses half
APOLLO Sentinel:   Health Factor < 1.0  →  AI Evaluation   →  JIT Rescue OR 15% Surgical Liquidation
```

### How It Works

1. **AI Oracle** monitors positions in real-time via Next.js API Routes
2. **ZKID Verification** checks if user holds a "Low Risk" Soulbound Token
3. **Smart Decision**: ZKID holders get **rescued**, others face minimal **15% liquidation**
4. **On-Chain Execution** via ApolloSentinel contract on HashKey Chain

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        APOLLO Sentinel                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐ │
│   │   Frontend   │───▶│  Next.js API     │───▶│  HashKey     │ │
│   │   (React)    │    │  /evaluate-risk  │    │  Chain       │ │
│   │   + Wagmi    │◀───│  AI Oracle       │◀───│  Testnet     │ │
│   └──────────────┘    └──────────────────┘    └──────────────┘ │
│         │                     │                      │         │
│         │              ┌──────┴──────┐               │         │
│         │              │ Risk Engine │               │         │
│         │              │ HF >= 1.0 → Safe            │         │
│         │              │ HF >= 0.95 → Rescue         │         │
│         │              │ HF < 0.95 → Liquidate       │         │
│         │              └─────────────┘               │         │
│         │                                            │         │
│         └────────────────────────────────────────────┘         │
│                                                                 │
│   Smart Contracts (HashKey Testnet - Chain ID: 133)            │
│   ├── ApolloSentinel.sol  → JIT Rescue + Liquidation Engine    │
│   ├── ApolloZKID.sol      → Soulbound Identity Token (SBT)     │
│   └── MockUSDT.sol        → Test Stablecoin with Faucet        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📜 Deployed Contracts

> **Network:** HashKey Chain Testnet (Chain ID: `133`)

| Contract | Address | Verified |
|----------|---------|----------|
| **ApolloSentinel** | `0xB4f9C2151B73eDEa730A72e9642C971d803Fd096` | ✅ |
| **ApolloZKID** | `0x99D1beDEa8d628b2Bd1Cd136F3348d1d680D6682` | ✅ |
| **MockUSDT** | `0x8A65a9ae5057eB846ce06c1E890f0aB8ADB05777` | ✅ |

**Explorer:** [HashKey Testnet Explorer](https://testnet-explorer.hsk.xyz)

---

## 🚀 Quick Start (3 Steps)

### Prerequisites
- Node.js 20+
- MetaMask with HashKey Testnet configured

### 1️⃣ Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/apollo-sentinel.git
cd apollo-sentinel
npm install && cd frontend && npm install && cd ..
```

### 2️⃣ Configure Environment

```bash
# Copy example env files
cp .env.example .env
cp frontend/.env.local.example frontend/.env.local

# Edit .env with your keys (see .env.example for guidance)
```

### 3️⃣ Run Locally

```bash
npm run dev
# Opens http://localhost:3000
```

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| **Access Control** | `onlyAIOracle` modifier restricts executeDecision to backend signer |
| **Reentrancy Protection** | OpenZeppelin's `ReentrancyGuard` on all state-changing functions |
| **Amount Limits** | `MAX_RESCUE_AMOUNT = 1M USDT` caps per-operation exposure |
| **Soulbound Tokens** | ZKID cannot be transferred - prevents credential farming |
| **RPC Resilience** | 8-second timeout with graceful 503 responses |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | HashKey Chain (EVM-compatible) |
| **Smart Contracts** | Solidity 0.8.24, OpenZeppelin 5.x |
| **Frontend** | Next.js 15, React 19, TailwindCSS 4 |
| **Web3** | Wagmi 2.x, Viem, Ethers.js 6 |
| **Deployment** | Hardhat, Vercel |

---

## 📊 Hackathon Tracks

APOLLO Sentinel competes across multiple tracks:

- ✅ **DeFi Innovation** - Novel liquidation protection mechanism
- ✅ **AI Integration** - Serverless AI Oracle for risk evaluation
- ✅ **Identity/Privacy** - ZKID Soulbound Tokens for creditworthiness

---

## 🗺️ Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| **V1 - MVP** | ✅ Complete | Core contracts, JIT rescue, ZKID minting |
| **V2 - Mainnet** | 🔄 Planned | BigInt precision, DAO governance for limits |
| **V3 - Multi-chain** | 📋 Research | Cross-chain rescue vaults, EigenLayer integration |

---

## 👥 Team

Built with ❤️ for the HashKey On-Chain Horizon Hackathon 2026.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**🛡️ APOLLO Sentinel - Protecting DeFi Users, One Rescue at a Time**

*Technology Empowers Finance. Innovation Reconstructs Ecosystem.*

</div>
