'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';

export function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Prevent hydration mismatch by only rendering wallet state after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Show loading placeholder during SSR/hydration
  if (!mounted) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span className="text-gray-400 font-mono text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-mono text-sm">Connected</span>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Address</p>
          <p className="font-mono text-sm text-white break-all">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <p className="text-gray-400 text-xs mt-2">Network</p>
          <p className="font-mono text-sm text-cyan-400">{chain?.name || 'Unknown'}</p>
        </div>
        <button
          onClick={() => disconnect()}
          className="w-full py-2 px-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg text-red-400 transition-all duration-200"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span className="text-red-400 font-mono text-sm">Not Connected</span>
      </div>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
        >
          {isPending ? 'Connecting...' : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  );
}
