import { NextResponse } from "next/server";
import { ethers } from "ethers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============ CONSTANTS ============
const RPC_TIMEOUT_MS = 8000; // 8s to stay under Vercel's 10s limit
const SENTINEL_ABI = [
  "function executeDecision(address user, bool isRescue, uint256 amount) external",
  "function wouldBeRescued(address user) view returns (bool)",
];

// ============ TYPES ============
type EvaluateRiskRequest = {
  userAddress: string;
  collateralAmount: string | number;
  debtAmount: string | number;
};

type RiskEvaluation = {
  healthFactor: number;
  decision: "safe" | "rescue" | "liquidate";
  isRescue: boolean;
  message: string;
};

// ============ HELPERS ============

function validatePrivateKey(value: string): string {
  const normalized = value.startsWith("0x") ? value : `0x${value}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error("BACKEND_SIGNER_PRIVATE_KEY is not a valid 32-byte hex string");
  }
  return normalized;
}

function parseNonNegativeNumber(value: string, fieldName: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a valid non-negative number`);
  }
  return parsed;
}

function evaluateRisk(collateral: number, debt: number): RiskEvaluation {
  if (debt === 0) {
    return {
      healthFactor: 100,
      decision: "safe",
      isRescue: true,
      message: "Debt is zero, position considered safe",
    };
  }

  // TODO: Refactor JS Number arithmetic to BigInt precision before Mainnet deployment. Acceptable loss for Hackathon MVP latency.
  const healthFactor = collateral / debt;

  if (healthFactor >= 1.0) {
    return {
      healthFactor,
      decision: "safe",
      isRescue: true,
      message: "Position is healthy, no intervention required",
    };
  }

  if (healthFactor >= 0.95) {
    return {
      healthFactor,
      decision: "rescue",
      isRescue: true,
      message: `AI Decision: RESCUE - Health factor ${healthFactor.toFixed(4)} is in rescue zone`,
    };
  }

  return {
    healthFactor,
    decision: "liquidate",
    isRescue: false,
    message: `AI Decision: LIQUIDATE - Health factor ${healthFactor.toFixed(4)} is below threshold`,
  };
}

async function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMsg)), ms)
  );
  return Promise.race([promise, timeout]);
}

// ============ API HANDLER ============

export async function POST(request: Request) {
  // --- 1. Parse and validate request body ---
  let body: Partial<EvaluateRiskRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const userAddress = body.userAddress?.toString().trim();
  const collateralAmountInput = body.collateralAmount?.toString().trim();
  const debtAmountInput = body.debtAmount?.toString().trim();

  if (!userAddress || !collateralAmountInput || !debtAmountInput) {
    return NextResponse.json(
      { error: "Missing required fields: userAddress, collateralAmount, debtAmount" },
      { status: 400 }
    );
  }

  if (!ethers.isAddress(userAddress)) {
    return NextResponse.json(
      { error: "Invalid user address" },
      { status: 400 }
    );
  }

  let collateralAmount: number;
  let debtAmount: number;
  try {
    collateralAmount = parseNonNegativeNumber(collateralAmountInput, "collateralAmount");
    debtAmount = parseNonNegativeNumber(debtAmountInput, "debtAmount");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid numeric input" },
      { status: 400 }
    );
  }

  // --- 2. Evaluate risk locally (no RPC needed) ---
  const { healthFactor, decision, isRescue, message } = evaluateRisk(collateralAmount, debtAmount);

  // --- 3. Validate server configuration ---
  const testnetRpcUrl = process.env.TESTNET_RPC_URL;
  const backendSignerPrivateKey = process.env.BACKEND_SIGNER_PRIVATE_KEY;
  const sentinelAddress = process.env.CONTRACT_ADDRESS_APOLLO_SENTINEL;

  if (!testnetRpcUrl || !backendSignerPrivateKey || !sentinelAddress) {
    return NextResponse.json(
      { error: "Server configuration incomplete. Contact administrator." },
      { status: 500 }
    );
  }

  if (!ethers.isAddress(sentinelAddress)) {
    return NextResponse.json(
      { error: "Invalid sentinel contract address in server config" },
      { status: 500 }
    );
  }

  // --- 4. Validate private key format before instantiating wallet ---
  let validatedPrivateKey: string;
  try {
    validatedPrivateKey = validatePrivateKey(backendSignerPrivateKey);
  } catch {
    return NextResponse.json(
      { error: "Server signer configuration error" },
      { status: 500 }
    );
  }

  // --- 5. Connect to RPC with timeout protection ---
  let provider: ethers.JsonRpcProvider;
  let signer: ethers.Wallet;
  let sentinel: ethers.Contract;
  let hasZKID: boolean;

  try {
    provider = new ethers.JsonRpcProvider(testnetRpcUrl);
    signer = new ethers.Wallet(validatedPrivateKey, provider);
    sentinel = new ethers.Contract(sentinelAddress, SENTINEL_ABI, signer);

    hasZKID = await withTimeout(
      sentinel.wouldBeRescued(userAddress) as Promise<boolean>,
      RPC_TIMEOUT_MS,
      "HashKey RPC timeout - network may be congested"
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "RPC connection failed";
    const isTimeout = errorMessage.includes("timeout");
    return NextResponse.json(
      {
        error: "Blockchain network unavailable",
        details: isTimeout ? "HashKey Testnet RPC timeout" : errorMessage,
      },
      { status: 503 }
    );
  }

  // --- 6. Handle safe positions (no on-chain action needed) ---
  if (decision === "safe") {
    return NextResponse.json({
      success: true,
      decision,
      txHash: null,
      userAddress,
      healthFactor,
      hasZKID,
      message,
    });
  }

  // --- 7. Execute on-chain decision ---
  try {
    const amountForDecision = ethers.parseUnits(debtAmountInput, 6);

    const tx = await withTimeout(
      sentinel.executeDecision(userAddress, isRescue, amountForDecision),
      RPC_TIMEOUT_MS,
      "Transaction submission timeout"
    );

    return NextResponse.json({
      success: true,
      decision,
      txHash: tx.hash,
      userAddress,
      healthFactor,
      hasZKID,
      message,
      status: "pending",
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    // Check if it's a contract revert
    if (errorMessage.includes("revert") || errorMessage.includes("execution reverted")) {
      return NextResponse.json(
        {
          error: "Contract execution reverted",
          details: errorMessage,
        },
        { status: 422 }
      );
    }

    // Check if it's a timeout
    if (errorMessage.includes("timeout")) {
      return NextResponse.json(
        {
          error: "Transaction timeout",
          details: "HashKey Testnet is congested. Please retry.",
        },
        { status: 503 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: "Failed to execute decision",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
