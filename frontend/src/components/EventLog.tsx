'use client';

import { useEffect, useRef } from 'react';

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error' | 'warning' | 'ai';
  message: string;
  txHash?: string;
  details?: string;
}

interface EventLogProps {
  logs: LogEntry[];
}

export function EventLog({ logs }: EventLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'ai': return 'text-purple-400';
      default: return 'text-cyan-400';
    }
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return '[+]';
      case 'error': return '[!]';
      case 'warning': return '[*]';
      case 'ai': return '[AI]';
      default: return '[>]';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-black/80 rounded-lg border border-gray-700 h-full overflow-hidden flex flex-col">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-gray-400 text-sm font-mono ml-2">HashKey Sentinel v1.0</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-mono">LIVE</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Boot sequence */}
        <div className="text-gray-500 mb-4">
          <p>Apollo Sentinel System v1.0.0</p>
          <p>Initializing AI Oracle connection...</p>
          <p className="text-green-400">[OK] Connected to testnet network</p>
          <p className="text-green-400">[OK] AI Risk Engine online</p>
          <p className="text-cyan-400">Monitoring for liquidation events...</p>
          <p className="text-gray-600">{'─'.repeat(50)}</p>
        </div>

        {/* Log entries */}
        {logs.map((log) => (
          <div key={log.id} className="group">
            <div className="flex gap-2">
              <span className="text-gray-500">{formatTime(log.timestamp)}</span>
              <span className={getLogColor(log.type)}>{getLogIcon(log.type)}</span>
              <span className={getLogColor(log.type)}>{log.message}</span>
            </div>
            {log.details && (
              <div className="ml-16 text-gray-500 text-xs mt-1">
                {log.details}
              </div>
            )}
            {log.txHash && (
              <div className="ml-16 text-gray-500 text-xs mt-1">
                TX: <span className="text-cyan-400/70">{log.txHash.slice(0, 10)}...{log.txHash.slice(-8)}</span>
              </div>
            )}
          </div>
        ))}

        {/* Blinking cursor */}
        <div className="flex items-center gap-1">
          <span className="text-green-400">$</span>
          <span className="w-2 h-4 bg-green-400 animate-pulse"></span>
        </div>
        <div ref={logEndRef} />
      </div>

      {/* Terminal Footer */}
      <div className="bg-gray-800/50 px-4 py-2 border-t border-gray-700 flex justify-between text-xs font-mono text-gray-500">
        <span>Events: {logs.length}</span>
        <span>Apollo AI Oracle</span>
      </div>
    </div>
  );
}

// Visual alert component for rescues/liquidations
interface AlertBannerProps {
  type: 'rescue' | 'liquidation';
  address: string;
  amount: string;
  onClose: () => void;
}

export function AlertBanner({ type, address, amount, onClose }: AlertBannerProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isRescue = type === 'rescue';

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-2xl border-2 animate-pulse ${
      isRescue
        ? 'bg-green-900/90 border-green-500 shadow-green-500/50'
        : 'bg-red-900/90 border-red-500 shadow-red-500/50'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isRescue ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {isRescue ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <div>
          <h3 className={`font-bold text-lg ${isRescue ? 'text-green-400' : 'text-red-400'}`}>
            {isRescue ? 'JIT RESCUE EXECUTED' : 'SURGICAL LIQUIDATION'}
          </h3>
          <p className="text-white text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <p className="text-gray-300 text-sm">
            Amount: {amount} USDT
          </p>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
