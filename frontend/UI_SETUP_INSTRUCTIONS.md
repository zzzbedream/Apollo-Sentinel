# 🚀 APOLLO Sentinel - UI Integration Setup

## Quick Setup Commands

Run these commands in your terminal from the `frontend` directory:

```powershell
# 1. Create dashboard directory
mkdir src\app\dashboard

# 2. Install dependencies (if not already installed)
npm install lucide-react

# 3. Start development server
npm run dev
```

## Manual File Creation

Since I couldn't create the dashboard folder automatically, copy the content from:
`DASHBOARD_PAGE_CONTENT.tsx` → `src/app/dashboard/page.tsx`

## What Changed

### ✅ Landing Page (`src/app/page.tsx`)
- New professional design with HashKey Hackathon branding
- Hero section with "Stop Punishing Users" messaging
- Features section explaining AI Oracle, ZKID, and JIT Rescue
- Technology section showing HashKey Chain integration
- "Launch App" button → routes to `/dashboard`

### ✅ Dashboard (`src/app/dashboard/page.tsx` - to be created)
- Full institutional dashboard design
- Side navigation (Terminal, DeFi Market, ZK Identity, Oracle Logs, Risk Engine)
- ZKID Risk Profile card with verification status
- Transaction form with Collateral/Debt inputs
- Real-time Health Factor visualization
- Oracle AI Terminal with live logs
- "Simulate Market Crash" button connected to real `/api/evaluate-risk`
- Event listeners for JIT_RescueExecuted and SurgicalLiquidation

### ✅ Global Styles (`src/app/globals.css`)
- APOLLO Sentinel Design System colors
- Glass effect utilities
- Hero gradient
- Custom fonts (Inter, Plus Jakarta Sans, Roboto Mono)

## Architecture

```
/                   → Landing Page (Server Component) 
/dashboard          → Dashboard (Client Component with Web3)
/api/evaluate-risk  → AI Oracle API (Already working)
```

## Environment Variables for Vercel

When deploying to Vercel, add these:

```
NEXT_PUBLIC_ZKID_ADDRESS=<deployed address>
NEXT_PUBLIC_SENTINEL_ADDRESS=<deployed address>
NEXT_PUBLIC_TESTNET_NAME=HashKey Testnet
NEXT_PUBLIC_CHAIN_ID=133
BACKEND_SIGNER_PRIVATE_KEY=<your oracle wallet private key>
TESTNET_RPC_URL=https://testnet.hsk.xyz
```

⚠️ NEVER add `NEXT_PUBLIC_` prefix to `BACKEND_SIGNER_PRIVATE_KEY`!

## Testing Flow

1. Open http://localhost:3000 → See Landing Page
2. Click "Launch App" → Navigate to /dashboard
3. Connect wallet (MetaMask on HashKey Testnet)
4. Set Collateral: 50000, Debt: 55000 (Health Factor < 0.95)
5. Click "Simulate Market Crash"
6. Watch Terminal for API calls and blockchain confirmation
7. See green/red banner when event is confirmed on-chain
