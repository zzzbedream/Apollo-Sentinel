'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useWatchContractEvent, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import Link from 'next/link';
import { WalletConnect } from '@/components/WalletConnect';
import { ZKID_ABI, SENTINEL_ABI } from '@/lib/contracts';

// Contract addresses from env
const ZKID_ADDRESS = (process.env.NEXT_PUBLIC_ZKID_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`;
const SENTINEL_ADDRESS = (process.env.NEXT_PUBLIC_SENTINEL_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512') as `0x${string}`;
const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://testnet-explorer.hsk.xyz';

// Navigation sections
type NavSection = 'terminal' | 'defi' | 'zkid' | 'logs' | 'risk';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'sys' | 'api' | 'ai' | 'tx' | 'success' | 'error' | 'link' | 'alert' | 'liquidated';
  message: string;
  txHash?: string;
}

interface EvaluateRiskApiResponse {
  success?: boolean;
  decision: 'safe' | 'rescue' | 'liquidate';
  message: string;
  txHash: string | null;
  hasZKID?: boolean;
  error?: string;
  details?: string;
}

// ============ WALLET GATE COMPONENT ============
function WalletGate({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Show loading screen during SSR/hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0c1324] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🛡</span>
          </div>
          <p className="text-slate-400 text-sm">Loading APOLLO Sentinel...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0c1324] flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="relative bg-[#151b2d] rounded-2xl p-8 border border-cyan-400/20 shadow-2xl">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-4xl">🛡</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black text-center text-white mb-2 tracking-tight">
              APOLLO Sentinel
            </h1>
            <p className="text-slate-400 text-center mb-8">
              AI-Powered DeFi Protection on HashKey Chain
            </p>

            {/* Network Badge */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 bg-[#070d1f] px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                  HashKey Testnet
                </span>
              </div>
            </div>

            {/* Connect Button */}
            <div className="flex justify-center">
              <WalletConnect />
            </div>

            {/* Footer */}
            <p className="text-slate-500 text-xs text-center mt-8">
              Connect your wallet to access the Sentinel Dashboard
            </p>
          </div>

          {/* Hackathon Badge */}
          <div className="mt-6 text-center">
            <span className="text-slate-600 text-xs">
              Built for HashKey On-Chain Horizon Hackathon 2026
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [activeSection, setActiveSection] = useState<NavSection>('defi');
  const [collateralAmount, setCollateralAmount] = useState<string>('50000');
  const [debtAmount, setDebtAmount] = useState<string>('32500');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [pendingTx, setPendingTx] = useState<string | null>(null);
  const [alertState, setAlertState] = useState<'idle' | 'rescue' | 'liquidation'>('idle');

  // Calculate health factor
  const healthFactor = collateralAmount && debtAmount && Number(debtAmount) > 0
    ? Number(collateralAmount) / Number(debtAmount)
    : 0;

  // Check if user has ZKID
  const { data: hasZKID, refetch: refetchZKID } = useReadContract({
    address: ZKID_ADDRESS,
    abi: ZKID_ABI,
    functionName: 'hasZKID',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // ZKID Minting
  const { writeContract: mintZKID, data: mintHash, isPending: isMinting } = useWriteContract();
  const { isLoading: isConfirmingMint, isSuccess: mintSuccess } = useWaitForTransactionReceipt({ hash: mintHash });

  useEffect(() => {
    if (mintHash) {
      addLog('tx', `ZKID Mint transaction submitted: ${mintHash.slice(0, 10)}...${mintHash.slice(-6)}`, mintHash);
      addLog('link', `View on Explorer`, mintHash);
    }
  }, [mintHash]);

  useEffect(() => {
    if (mintSuccess && mintHash) {
      refetchZKID();
      addLog('success', 'ZKID Soulbound Token minted successfully!');
    }
  }, [mintSuccess, mintHash]);

  const handleMintZKID = () => {
    if (!address) return;
    mintZKID({
      address: ZKID_ADDRESS,
      abi: ZKID_ABI,
      functionName: 'mintZKID',
      args: [address],
    });
  };

  // Add log entry
  const addLog = useCallback((type: LogEntry['type'], message: string, txHash?: string) => {
    const entry: LogEntry = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
      type,
      message,
      txHash,
    };
    setLogs(prev => [...prev, entry]);
  }, []);

  // Watch for JIT Rescue events
  useWatchContractEvent({
    address: SENTINEL_ADDRESS,
    abi: SENTINEL_ABI,
    eventName: 'JIT_RescueExecuted',
    onLogs(eventLogs) {
      eventLogs.forEach((log) => {
        const user = log.args.user as string;
        const amount = log.args.amount as bigint;
        const amountStr = (Number(amount) / 1e6).toFixed(2);
        addLog('success', `JIT RESCUE EXECUTED. User ${user.slice(0, 6)}...${user.slice(-4)} protected. Amount: ${amountStr} USDT`);
        setAlertState('rescue');
        setPendingTx(null);
        setIsSimulating(false);
      });
    },
  });

  // Watch for Surgical Liquidation events
  useWatchContractEvent({
    address: SENTINEL_ADDRESS,
    abi: SENTINEL_ABI,
    eventName: 'SurgicalLiquidation',
    onLogs(eventLogs) {
      eventLogs.forEach((log) => {
        const user = log.args.user as string;
        const amount = log.args.amount as bigint;
        const amountStr = (Number(amount) / 1e6).toFixed(2);
        addLog('liquidated', `SURGICAL LIQUIDATION. User ${user.slice(0, 6)}...${user.slice(-4)}. 15% liquidated: ${amountStr} USDT`);
        setAlertState('liquidation');
        setPendingTx(null);
        setIsSimulating(false);
      });
    },
  });

  // Handle market crash simulation
  const handleSimulateCrash = async () => {
    if (!isConnected || !address) {
      addLog('error', 'Wallet not connected. Please connect wallet first.');
      return;
    }

    setIsSimulating(true);
    setAlertState('idle');
    addLog('sys', `Intercepting liquidation event for ${address.slice(0, 6)}...${address.slice(-4)}`);
    addLog('api', 'Calling HashKey TEE Oracle...');
    addLog('ai', 'Evaluating Health Factor...');

    try {
      const response = await fetch('/api/evaluate-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          collateralAmount: collateralAmount,
          debtAmount: debtAmount,
        }),
      });

      // Handle empty responses gracefully
      const text = await response.text();
      if (!text) {
        throw new Error('Server returned empty response - check API configuration');
      }
      
      let result: EvaluateRiskApiResponse;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(`Invalid server response: ${text.slice(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(result.details || result.error || 'API request failed');
      }

      if (result.txHash) {
        addLog('tx', `Transaction submitted: ${result.txHash.slice(0, 10)}...${result.txHash.slice(-6)}`, result.txHash);
        addLog('link', `View on Explorer: ${EXPLORER_URL}/tx/${result.txHash}`, result.txHash);
        addLog('sys', 'Waiting for block confirmation...');
        setPendingTx(result.txHash);
      } else {
        addLog('success', `Decision: ${result.decision.toUpperCase()} - ${result.message}`);
        setIsSimulating(false);
      }
    } catch (error) {
      addLog('error', `Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSimulating(false);
      setPendingTx(null);
    }
  };

  // Initialize logs
  useEffect(() => {
    addLog('sys', 'SENTINEL-NODE-01 INITIALIZED...');
    addLog('sys', 'Establishing secure enclave connection...');
    addLog('success', 'TEE HANDSHAKE SUCCESSFUL');
    addLog('sys', 'Waiting for market events...');
  }, [addLog]);

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 8);
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'sys': return 'text-cyan-400';
      case 'api': return 'text-orange-300';
      case 'ai': return 'text-orange-300';
      case 'tx': return 'text-cyan-300';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'link': return 'text-blue-400 underline';
      case 'alert': return 'text-orange-400';
      case 'liquidated': return 'text-amber-500';
      default: return 'text-slate-300';
    }
  };

  // ============ RENDER ACTIVE SECTION ============
  const renderSection = () => {
    switch (activeSection) {
      case 'terminal':
        return <TerminalSection logs={logs} pendingTx={pendingTx} alertState={alertState} formatTime={formatTime} getLogColor={getLogColor} />;
      case 'defi':
        return (
          <DefiMarketSection
            hasZKID={!!hasZKID}
            collateralAmount={collateralAmount}
            setCollateralAmount={setCollateralAmount}
            debtAmount={debtAmount}
            setDebtAmount={setDebtAmount}
            healthFactor={healthFactor}
            isSimulating={isSimulating}
            isConnected={isConnected}
            handleSimulateCrash={handleSimulateCrash}
            handleMintZKID={handleMintZKID}
            isMinting={isMinting}
            isConfirmingMint={isConfirmingMint}
            logs={logs}
            pendingTx={pendingTx}
            alertState={alertState}
            formatTime={formatTime}
            getLogColor={getLogColor}
          />
        );
      case 'zkid':
        return <ZKIDSection hasZKID={!!hasZKID} handleMintZKID={handleMintZKID} isMinting={isMinting} isConfirmingMint={isConfirmingMint} address={address} />;
      case 'logs':
        return <OracleLogsSection logs={logs} formatTime={formatTime} getLogColor={getLogColor} />;
      case 'risk':
        return <RiskEngineSection healthFactor={healthFactor} hasZKID={!!hasZKID} />;
      default:
        return null;
    }
  };

  return (
    <WalletGate>
      <div className="min-h-screen bg-[#0c1324] text-[#dce1fb] overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-[#151b2d] shadow-lg h-16 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-tighter text-cyan-400 uppercase hover:opacity-80 transition-opacity">
              APOLLO SENTINEL
            </Link>
            <nav className="hidden md:flex gap-1">
              {(['defi', 'zkid', 'logs'] as NavSection[]).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    activeSection === section
                      ? 'text-cyan-400 bg-[#191f31]'
                      : 'text-slate-400 hover:text-white hover:bg-[#191f31]'
                  }`}
                >
                  {section === 'defi' ? 'DeFi Market' : section === 'zkid' ? 'ZK Identity' : 'Oracle Logs'}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#2e3447] px-3 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">HashKey Testnet</span>
            </div>
            <WalletConnect />
          </div>
        </header>

        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          {/* Side Navigation */}
          <aside className="bg-[#151b2d] flex flex-col h-full w-64 py-6 border-r-0">
            <div className="px-6 mb-8">
              <div className="font-black text-cyan-400 tracking-tighter">SENTINEL</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Institutional Node</div>
            </div>
            <nav className="flex-grow space-y-1">
              <SideNavItem icon="terminal" label="Terminal" active={activeSection === 'terminal'} onClick={() => setActiveSection('terminal')} />
              <SideNavItem icon="account_balance" label="DeFi Market" active={activeSection === 'defi'} onClick={() => setActiveSection('defi')} />
              <SideNavItem icon="fingerprint" label="ZK Identity" active={activeSection === 'zkid'} onClick={() => setActiveSection('zkid')} />
              <SideNavItem icon="receipt_long" label="Oracle Logs" active={activeSection === 'logs'} onClick={() => setActiveSection('logs')} />
              <SideNavItem icon="security" label="Risk Engine" active={activeSection === 'risk'} onClick={() => setActiveSection('risk')} />
            </nav>
            <div className="px-4 mt-auto">
              <button 
                onClick={handleSimulateCrash}
                disabled={isSimulating || !isConnected}
                className="w-full py-3 bg-red-900/50 text-red-300 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-900/70 transition-colors disabled:opacity-50"
              >
                Emergency JIT Rescue
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow p-6 overflow-y-auto">
            {renderSection()}
          </main>
        </div>
      </div>
    </WalletGate>
  );
}

// ============ SECTION COMPONENTS ============

function TerminalSection({ logs, pendingTx, alertState, formatTime, getLogColor }: {
  logs: LogEntry[];
  pendingTx: string | null;
  alertState: 'idle' | 'rescue' | 'liquidation';
  formatTime: (date: Date) => string;
  getLogColor: (type: LogEntry['type']) => string;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">▣</span>
          <h3 className="font-bold text-lg tracking-tight uppercase">Oracle AI Terminal</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] text-slate-500 font-mono uppercase">Status: </div>
          <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold">
            {pendingTx ? 'Mining' : 'Monitoring'}
          </div>
        </div>
      </div>
      <div className="flex-grow bg-[#070d1f] rounded-xl border border-cyan-400/20 p-6 font-mono text-xs overflow-hidden flex flex-col">
        <div className="flex-grow space-y-3 overflow-y-auto pr-4">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <span className="text-slate-600">[{formatTime(log.timestamp)}]</span>
              {log.type === 'link' && log.txHash ? (
                <a 
                  href={`${EXPLORER_URL}/tx/${log.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                >
                  [LINK] 🔗 View Transaction on Explorer →
                </a>
              ) : (
                <span className={getLogColor(log.type)}>
                  [{log.type.toUpperCase()}] {log.message}
                </span>
              )}
            </div>
          ))}
          {pendingTx && (
            <div className="flex gap-4 items-center">
              <span className="text-slate-600">[{formatTime(new Date())}]</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">[ON-CHAIN] Waiting for block confirmation...</span>
                <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>
        {/* Alert Banners */}
        <div className="mt-6 space-y-2">
          {alertState === 'rescue' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 text-lg">✓</span>
                <div className="font-bold text-emerald-400 tracking-widest">JIT RESCUE EXECUTED. USER PROTECTED.</div>
              </div>
            </div>
          )}
          {alertState === 'liquidation' && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-lg">⚠</span>
                <div className="font-bold text-red-400 tracking-widest uppercase">Surgical Liquidation. 15% liquidated.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DefiMarketSection({ hasZKID, collateralAmount, setCollateralAmount, debtAmount, setDebtAmount, healthFactor, isSimulating, isConnected, handleSimulateCrash, handleMintZKID, isMinting, isConfirmingMint, logs, pendingTx, alertState, formatTime, getLogColor }: {
  hasZKID: boolean;
  collateralAmount: string;
  setCollateralAmount: (v: string) => void;
  debtAmount: string;
  setDebtAmount: (v: string) => void;
  healthFactor: number;
  isSimulating: boolean;
  isConnected: boolean;
  handleSimulateCrash: () => void;
  handleMintZKID: () => void;
  isMinting: boolean;
  isConfirmingMint: boolean;
  logs: LogEntry[];
  pendingTx: string | null;
  alertState: 'idle' | 'rescue' | 'liquidation';
  formatTime: (date: Date) => string;
  getLogColor: (type: LogEntry['type']) => string;
}) {
  return (
    <div className="flex gap-6 h-full">
      {/* Left Column */}
      <div className="w-1/2 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black tracking-tight">APOLLO Sentinel</h2>
          <p className="text-slate-400 font-medium">Institutional Dashboard — HashKey Chain Testnet</p>
        </div>

        {/* ZKID Risk Profile Card */}
        <div className="bg-[#151b2d] p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">ZK Identity Status</div>
              <h3 className="text-xl font-bold">ZKID Risk Profile</h3>
            </div>
            {hasZKID ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <span className="text-emerald-400 text-sm">✓</span>
                <span className="text-emerald-400 text-xs font-bold uppercase">ZKID Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                <span className="text-orange-400 text-xs font-bold uppercase">No ZKID</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="font-mono text-lg text-cyan-400">0.02</div>
                <div className="text-[10px] text-slate-500 uppercase">Risk Score</div>
              </div>
              <div className="w-px h-8 bg-slate-700 self-center"></div>
              <div className="text-center">
                <div className="font-mono text-lg text-emerald-400">LOW</div>
                <div className="text-[10px] text-slate-500 uppercase">Tier</div>
              </div>
            </div>
            <button 
              onClick={handleMintZKID}
              disabled={hasZKID || isMinting || isConfirmingMint}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90 disabled:opacity-50 px-4 py-2 rounded font-bold text-sm text-[#00363a] transition-all"
            >
              {isMinting || isConfirmingMint ? 'Minting...' : hasZKID ? 'ZKID Owned' : 'Mint SBT (Low Risk)'}
            </button>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="bg-[#151b2d] p-6 rounded-xl flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-slate-400">Collateral Amount (USDT)</label>
              <div className="relative">
                <input
                  type="number"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  className="w-full bg-[#070d1f] border-none focus:ring-1 focus:ring-cyan-400/40 text-[#dce1fb] font-mono py-4 px-4 rounded-lg"
                  placeholder="50,000.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-500 text-sm">USDT</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-slate-400">Debt Amount (USDT)</label>
              <div className="relative">
                <input
                  type="number"
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(e.target.value)}
                  className="w-full bg-[#070d1f] border-none focus:ring-1 focus:ring-cyan-400/40 text-[#dce1fb] font-mono py-4 px-4 rounded-lg"
                  placeholder="32,500.00"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-500 text-sm">USDT</span>
              </div>
            </div>
          </div>

          {/* Health Factor Visualization */}
          <div className="bg-[#070d1f] p-6 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-cyan-400 text-sm">❤</span>
                <span className="text-xs uppercase tracking-widest text-slate-500">Protocol Health Factor</span>
              </div>
              <div className={`text-4xl font-black font-mono ${
                healthFactor >= 1.5 ? 'text-cyan-400' : 
                healthFactor >= 1.0 ? 'text-yellow-400' : 
                healthFactor >= 0.95 ? 'text-orange-400' : 'text-red-400'
              }`}>
                {healthFactor.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-tighter mb-2">Stability Margin</div>
              <div className="w-32 h-2 bg-[#191f31] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    healthFactor >= 1.5 ? 'bg-cyan-400 shadow-[0_0_10px_#00dbe7]' :
                    healthFactor >= 1.0 ? 'bg-yellow-400' :
                    healthFactor >= 0.95 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(Math.max(healthFactor / 2, 0), 1) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSimulateCrash}
            disabled={isSimulating || !isConnected}
            className="w-full py-5 bg-red-500/80 hover:bg-red-500 disabled:bg-red-500/30 disabled:cursor-not-allowed text-white font-black uppercase tracking-[0.2em] rounded-lg shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {isSimulating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <span className="text-xl">⚡</span>
                Simulate Market Crash
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Terminal */}
      <div className="w-1/2">
        <TerminalSection logs={logs} pendingTx={pendingTx} alertState={alertState} formatTime={formatTime} getLogColor={getLogColor} />
      </div>
    </div>
  );
}

function ZKIDSection({ hasZKID, handleMintZKID, isMinting, isConfirmingMint, address }: {
  hasZKID: boolean;
  handleMintZKID: () => void;
  isMinting: boolean;
  isConfirmingMint: boolean;
  address: string | undefined;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-black tracking-tight mb-2">ZK Identity</h2>
      <p className="text-slate-400 mb-8">Soulbound Token credentials for preferential rescue terms</p>

      <div className="bg-[#151b2d] rounded-xl p-8 border border-cyan-400/20">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
            <span className="text-5xl">🔐</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">Apollo ZKID</h3>
            <p className="text-slate-400">Non-transferable Soulbound Token</p>
            {hasZKID && (
              <div className="mt-2 flex items-center gap-2 text-emerald-400">
                <span>✓</span>
                <span className="font-bold">Verified</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between py-3 border-b border-slate-700">
            <span className="text-slate-400">Status</span>
            <span className={hasZKID ? 'text-emerald-400 font-bold' : 'text-orange-400'}>{hasZKID ? 'Owned' : 'Not Minted'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-700">
            <span className="text-slate-400">Risk Tier</span>
            <span className="text-cyan-400 font-bold">LOW</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-700">
            <span className="text-slate-400">Rescue Priority</span>
            <span className="text-emerald-400 font-bold">HIGHEST</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-slate-400">Holder</span>
            <span className="font-mono text-sm">{address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '-'}</span>
          </div>
        </div>

        <button
          onClick={handleMintZKID}
          disabled={hasZKID || isMinting || isConfirmingMint}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90 disabled:opacity-50 text-[#00363a] font-bold text-lg rounded-lg transition-all"
        >
          {isMinting || isConfirmingMint ? 'Minting ZKID...' : hasZKID ? 'ZKID Already Owned' : 'Mint ZKID Soulbound Token'}
        </button>

        {!hasZKID && (
          <p className="text-slate-500 text-sm text-center mt-4">
            ZKID holders receive JIT rescue instead of liquidation when Health Factor drops below 1.0
          </p>
        )}
      </div>
    </div>
  );
}

function OracleLogsSection({ logs, formatTime, getLogColor }: {
  logs: LogEntry[];
  formatTime: (date: Date) => string;
  getLogColor: (type: LogEntry['type']) => string;
}) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-black tracking-tight mb-2">Oracle Logs</h2>
      <p className="text-slate-400 mb-6">Real-time AI Oracle activity feed</p>

      <div className="flex-grow bg-[#070d1f] rounded-xl border border-cyan-400/20 p-6 font-mono text-sm overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-slate-500">No logs yet. Simulate a market crash to generate activity.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <span className="text-slate-600 shrink-0">[{formatTime(log.timestamp)}]</span>
                {log.type === 'link' && log.txHash ? (
                  <a 
                    href={`${EXPLORER_URL}/tx/${log.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                  >
                    [LINK] 🔗 View Transaction on Explorer →
                  </a>
                ) : (
                  <span className={`${getLogColor(log.type)}`}>
                    [{log.type.toUpperCase()}] {log.message}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RiskEngineSection({ healthFactor, hasZKID }: { healthFactor: number; hasZKID: boolean }) {
  const getRiskLevel = () => {
    if (healthFactor >= 1.5) return { label: 'SAFE', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (healthFactor >= 1.0) return { label: 'MODERATE', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    if (healthFactor >= 0.95) return { label: 'HIGH - RESCUE ZONE', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { label: 'CRITICAL - LIQUIDATION', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const risk = getRiskLevel();

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-black tracking-tight mb-2">Risk Engine</h2>
      <p className="text-slate-400 mb-8">AI-powered risk assessment and protection status</p>

      <div className="grid gap-6">
        {/* Risk Level Card */}
        <div className={`${risk.bg} border border-current/20 rounded-xl p-8`}>
          <div className="text-xs uppercase tracking-widest text-slate-400 mb-2">Current Risk Level</div>
          <div className={`text-4xl font-black ${risk.color}`}>{risk.label}</div>
        </div>

        {/* Health Factor Display */}
        <div className="bg-[#151b2d] rounded-xl p-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Health Factor</div>
              <div className={`text-5xl font-black font-mono ${risk.color}`}>{healthFactor.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Threshold</div>
              <div className="text-2xl font-mono text-slate-400">1.00</div>
            </div>
          </div>
          <div className="h-4 bg-[#070d1f] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                healthFactor >= 1.5 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' :
                healthFactor >= 1.0 ? 'bg-yellow-500' :
                healthFactor >= 0.95 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(Math.max(healthFactor / 2, 0), 1) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Protection Status */}
        <div className="bg-[#151b2d] rounded-xl p-8">
          <div className="text-xs uppercase tracking-widest text-slate-400 mb-4">Protection Status</div>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${hasZKID ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
              <span className="text-3xl">{hasZKID ? '🛡' : '⚠'}</span>
            </div>
            <div>
              <div className={`text-xl font-bold ${hasZKID ? 'text-emerald-400' : 'text-orange-400'}`}>
                {hasZKID ? 'JIT Rescue Enabled' : 'Standard Liquidation'}
              </div>
              <div className="text-slate-400 text-sm">
                {hasZKID ? 'You will be rescued if HF < 1.0' : 'Mint ZKID to enable JIT rescue protection'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Side Navigation Item Component
function SideNavItem({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean; onClick: () => void }) {
  const iconMap: { [key: string]: string } = {
    terminal: '⌘',
    account_balance: '◈',
    fingerprint: '◉',
    receipt_long: '≡',
    security: '△',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-3 cursor-pointer transition-all text-left ${
        active 
          ? 'bg-[#191f31] text-cyan-400 border-r-4 border-cyan-400' 
          : 'text-slate-500 hover:text-slate-200 hover:bg-[#191f31]'
      }`}
    >
      <span>{iconMap[icon] || '•'}</span>
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </button>
  );
}
