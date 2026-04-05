'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ZKID_ABI } from '@/lib/contracts';

interface ZKIDRequestProps {
  zkidAddress: `0x${string}` | undefined;
  hasZKID: boolean;
  onMintSuccess?: () => void;
}

export function ZKIDRequest({ zkidAddress, hasZKID, onMintSuccess }: ZKIDRequestProps) {
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleRequestZKID = async () => {
    if (!address || !zkidAddress) return;
    setError(null);

    try {
      writeContract({
        address: zkidAddress,
        abi: ZKID_ABI,
        functionName: 'mintZKID',
        args: [address],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request ZKID');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <p className="text-gray-400 text-sm">Connect wallet to request ZKID</p>
      </div>
    );
  }

  if (hasZKID) {
    return (
      <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/50">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-400 font-semibold">ZKID Verified</span>
        </div>
        <p className="text-green-300/70 text-sm mt-2">
          You have a Low-Risk ZKID credential. You are eligible for JIT Rescue.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleRequestZKID}
        disabled={isPending || isConfirming || !zkidAddress}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
      >
        {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Request ZKID SBT'}
      </button>

      {isSuccess && (
        <div className="bg-green-900/30 rounded-lg p-3 border border-green-500/50">
          <p className="text-green-400 text-sm">ZKID minted successfully!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/50">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <p className="text-gray-400 text-xs">
        ZKID is a Soulbound Token that verifies your low-risk status. It cannot be transferred.
      </p>
    </div>
  );
}
