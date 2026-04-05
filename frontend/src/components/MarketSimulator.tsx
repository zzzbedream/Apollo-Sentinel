'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

export interface SimulationInput {
  collateralAmount: string;
  debtAmount: string;
  healthFactor: number;
}

interface MarketSimulatorProps {
  onSimulate: (input: SimulationInput) => Promise<void>;
  isLoading: boolean;
}

export function MarketSimulator({ onSimulate, isLoading }: MarketSimulatorProps) {
  const { isConnected } = useAccount();
  const [collateralAmount, setCollateralAmount] = useState('1000');
  const [debtAmount, setDebtAmount] = useState('1020');

  const collateralValue = Number(collateralAmount);
  const debtValue = Number(debtAmount);
  const safeCollateral = Number.isFinite(collateralValue) && collateralValue >= 0 ? collateralValue : 0;
  const safeDebt = Number.isFinite(debtValue) && debtValue >= 0 ? debtValue : 0;
  const healthFactor = safeDebt > 0 ? safeCollateral / safeDebt : 100;

  const getHealthFactorColor = () => {
    if (healthFactor >= 1.0) return 'text-green-400';
    if (healthFactor >= 0.95) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthFactorLabel = () => {
    if (healthFactor >= 1.0) return 'HEALTHY';
    if (healthFactor >= 0.95) return 'RESCUE ZONE';
    return 'LIQUIDATION ZONE';
  };

  const handleSimulate = () => {
    onSimulate({
      collateralAmount,
      debtAmount,
      healthFactor,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <label className="block text-gray-400 text-sm mb-2">Collateral (USDT)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={collateralAmount}
          onChange={(e) => setCollateralAmount(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
        />

        <label className="block text-gray-400 text-sm mt-4 mb-2">Debt (USDT)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={debtAmount}
          onChange={(e) => setDebtAmount(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white"
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-gray-400 text-sm">Calculated Health Factor</span>
          <span className={`font-mono text-2xl font-bold ${getHealthFactorColor()}`}>
            {healthFactor.toFixed(4)}
          </span>
        </div>
      </div>

      <div className={`rounded-lg p-3 border ${
        healthFactor >= 1.0
          ? 'bg-green-900/20 border-green-500/50'
          : healthFactor >= 0.95
            ? 'bg-yellow-900/20 border-yellow-500/50'
            : 'bg-red-900/20 border-red-500/50'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            healthFactor >= 1.0
              ? 'bg-green-500'
              : healthFactor >= 0.95
                ? 'bg-yellow-500'
                : 'bg-red-500'
          }`}></div>
          <span className={`font-semibold ${getHealthFactorColor()}`}>
            {getHealthFactorLabel()}
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {healthFactor >= 1.0
            ? 'Position is healthy. No intervention needed.'
            : healthFactor >= 0.95
              ? 'AI Oracle will attempt JIT Rescue if you have ZKID.'
              : 'Position will be liquidated. Health factor too low for rescue.'}
        </p>
      </div>

      <button
        onClick={handleSimulate}
        disabled={!isConnected || isLoading || safeDebt <= 0}
        className="w-full py-4 px-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg text-white font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Simulate Market Crash
          </>
        )}
      </button>

      {!isConnected && (
        <p className="text-gray-400 text-xs text-center">
          Connect wallet to run simulation
        </p>
      )}

      {safeDebt <= 0 && (
        <p className="text-red-400 text-xs text-center">
          Debt must be greater than 0 to evaluate risk.
        </p>
      )}
    </div>
  );
}
