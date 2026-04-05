import Link from 'next/link';

// ============ SVG ICON COMPONENTS ============

function IconShield({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 L20 7 L20 13 C20 17.5 16 20.5 12 22 C8 20.5 4 17.5 4 13 L4 7 Z" />
      <path d="M9 12 L11 14 L15 10" />
    </svg>
  );
}

function IconBrain({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.5 2 6 4.5 6 7C4.5 7 3 8.5 3 10.5C3 12 4 13.5 5.5 14C5 15 5 16.5 6 18C7 19.5 8.5 20 10 20H14C15.5 20 17 19.5 18 18C19 16.5 19 15 18.5 14C20 13.5 21 12 21 10.5C21 8.5 19.5 7 18 7C18 4.5 15.5 2 12 2Z" />
      <path d="M12 2V22" opacity="0.4" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function IconFingerprint({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10C12 8.895 12.895 8 14 8" />
      <path d="M2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12" />
      <path d="M7 12C7 9.239 9.239 7 12 7C14.761 7 17 9.239 17 12C17 14.5 16 16.5 14 18.5" />
      <path d="M12 12V17C12 18.5 11 20 9 21" />
      <path d="M4.271 18.346C5.5 16.5 6 14.5 6 12" />
      <path d="M20 15.5C19.5 17 18.5 18 17 19" />
    </svg>
  );
}

function IconZap({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconArrowRight({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconGithub({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function IconRocket({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function IconCheck({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconLock({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconTarget({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconGlobe({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ============ LANDING PAGE ============

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c1324] text-[#dce1fb]">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4 glass-effect border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <IconShield className="w-5 h-5 text-[#00363a]" />
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase">
              Apollo Sentinel
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#technology" className="text-sm text-slate-400 hover:text-white transition-colors">Technology</a>
            <a href="#roadmap" className="text-sm text-slate-400 hover:text-white transition-colors">Roadmap</a>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-[#00363a] font-bold text-sm rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Launch App
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 pt-20 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] orb-cyan rounded-full blur-[120px] animate-float-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] orb-purple rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb-teal rounded-full blur-[140px] opacity-50"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 bg-[#151b2d]/80 rounded-full mb-8 border border-cyan-500/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              HashKey On-Chain Horizon Hackathon
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-in-up-delay-1 text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            <span className="text-white">Stop Punishing</span>{' '}
            <span className="gradient-text-animated">
              Users
            </span>
            <br />
            <span className="text-white">For Market</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Volatility
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up-delay-2 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            APOLLO Sentinel is an AI-powered DeFi guardian that prevents destructive liquidations 
            through Just-In-Time rescues and ZKID-verified creditworthiness.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-[#00363a] font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Launch App
                <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <a
              href="https://github.com/zzzbedream/Apollo-Sentinel"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-[#151b2d] border border-slate-700 text-white font-semibold text-lg rounded-xl hover:bg-[#191f31] hover:border-slate-600 transition-all flex items-center gap-3"
            >
              <IconGithub className="w-5 h-5" />
              View on GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up-delay-4 grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-slate-800">
            <div>
              <div className="text-4xl font-black text-cyan-400 mb-2">$0</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Unfair Liquidations</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-400 mb-2">100%</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">ZKID Protected</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-400 mb-2">JIT</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">AI Rescue System</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Under the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                Sentinel&apos;s
              </span>{' '}
              Hood
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A revolutionary approach to DeFi protection powered by AI and zero-knowledge proofs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-glow bg-[#151b2d] p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors text-cyan-400">
                <IconBrain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Oracle Engine</h3>
              <p className="text-slate-400 leading-relaxed">
                Real-time health factor monitoring with predictive liquidation detection. 
                Our AI evaluates risk 24/7 and executes autonomous decisions on HashKey Chain.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-glow bg-[#151b2d] p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors text-emerald-400">
                <IconFingerprint className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">ZKID Soulbound Tokens</h3>
              <p className="text-slate-400 leading-relaxed">
                Verifiable creditworthiness credentials stored as non-transferable tokens. 
                Prove your track record without exposing sensitive financial data.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-glow bg-[#151b2d] p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors text-purple-400">
                <IconZap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Just-In-Time Rescue</h3>
              <p className="text-slate-400 leading-relaxed">
                Instead of harsh full liquidations, we execute surgical interventions. 
                ZKID holders get rescued; others face minimal 15% liquidation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-24 px-8 bg-[#0a0f1a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">
                Built on{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                  HashKey Chain
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                APOLLO Sentinel leverages HashKey Chain&apos;s high-throughput infrastructure 
                for real-time DeFi protection. Our architecture ensures sub-second response 
                times for critical rescue operations.
              </p>
              <div className="space-y-4">
                {[
                  'EVM-compatible Smart Contracts (Solidity)',
                  'Serverless AI Oracle (Next.js API Routes)',
                  'Ethers v6 Transaction Signing + Timeout Protection',
                  'Wagmi + Viem for Frontend Integration',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <IconCheck className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#151b2d] p-8 rounded-2xl border border-slate-800 animate-glow">
              <div className="font-mono text-sm space-y-2 text-slate-400">
                <div className="text-cyan-400">// APOLLO Sentinel Architecture</div>
                <div><span className="text-purple-400">const</span> sentinel = {"{"}</div>
                <div className="pl-4">chain: <span className="text-emerald-400">&quot;HashKey Testnet&quot;</span>,</div>
                <div className="pl-4">chainId: <span className="text-orange-400">133</span>,</div>
                <div className="pl-4">oracle: <span className="text-emerald-400">&quot;AI-Powered&quot;</span>,</div>
                <div className="pl-4">contracts: {"["}</div>
                <div className="pl-8"><span className="text-emerald-400">&quot;ApolloSentinel&quot;</span>,</div>
                <div className="pl-8"><span className="text-emerald-400">&quot;ApolloZKID&quot;</span>,</div>
                <div className="pl-8"><span className="text-emerald-400">&quot;MockUSDT&quot;</span></div>
                <div className="pl-4">{"]"},</div>
                <div className="pl-4">features: {"["}</div>
                <div className="pl-8"><span className="text-emerald-400">&quot;JIT Rescue&quot;</span>,</div>
                <div className="pl-8"><span className="text-emerald-400">&quot;ZKID Verification&quot;</span>,</div>
                <div className="pl-8"><span className="text-emerald-400">&quot;Surgical Liquidation&quot;</span></div>
                <div className="pl-4">{"]"}</div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ROADMAP SECTION ============ */}
      <section id="roadmap" className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Roadmap to{' '}
              <span className="gradient-text-animated">Mainnet</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A clear path from hackathon MVP to production-ready DeFi infrastructure
            </p>
          </div>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 roadmap-line opacity-30"></div>

            {/* Phase 1: Testnet MVP */}
            <div className="relative flex flex-col md:flex-row items-start mb-16 group">
              <div className="md:w-1/2 md:pr-16 md:text-right mb-4 md:mb-0">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Completed</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Phase 1 — Testnet MVP</h3>
                <p className="text-slate-400">Core smart contracts deployed and verified on HashKey Testnet. AI Oracle operational.</p>
              </div>
              <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 w-7 h-7 rounded-full bg-emerald-500 border-4 border-[#0c1324] flex items-center justify-center z-10">
                <IconCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="md:w-1/2 md:pl-16 pl-16 md:pl-16">
                <div className="bg-[#151b2d] p-5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-emerald-400"><IconCheck className="w-4 h-4" /> ApolloSentinel.sol deployed</div>
                  <div className="flex items-center gap-2 text-sm text-emerald-400"><IconCheck className="w-4 h-4" /> ApolloZKID Soulbound Token</div>
                  <div className="flex items-center gap-2 text-sm text-emerald-400"><IconCheck className="w-4 h-4" /> AI Oracle API route (evaluate-risk)</div>
                  <div className="flex items-center gap-2 text-sm text-emerald-400"><IconCheck className="w-4 h-4" /> Full Hardhat test suite (12/12 passing)</div>
                  <div className="flex items-center gap-2 text-sm text-emerald-400"><IconCheck className="w-4 h-4" /> Frontend dashboard with MetaMask</div>
                </div>
              </div>
            </div>

            {/* Phase 2: Security Audit */}
            <div className="relative flex flex-col md:flex-row items-start mb-16">
              <div className="md:w-1/2 md:pr-16 md:text-right mb-4 md:mb-0 md:order-1 order-2 pl-16 md:pl-0">
                <div className="bg-[#151b2d] p-5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex md:justify-end items-center gap-2 text-sm text-slate-400"><IconLock className="w-4 h-4" /> Professional smart contract audit</div>
                  <div className="flex md:justify-end items-center gap-2 text-sm text-slate-400"><IconLock className="w-4 h-4" /> Formal verification of rescue logic</div>
                  <div className="flex md:justify-end items-center gap-2 text-sm text-slate-400"><IconLock className="w-4 h-4" /> Bug bounty program launch</div>
                  <div className="flex md:justify-end items-center gap-2 text-sm text-slate-400"><IconLock className="w-4 h-4" /> Gas optimization review</div>
                </div>
              </div>
              <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 w-7 h-7 rounded-full bg-cyan-500 border-4 border-[#0c1324] flex items-center justify-center z-10">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div className="md:w-1/2 md:pl-16 mb-4 md:mb-0 md:order-2 order-1">
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Next</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Phase 2 — Security Audit</h3>
                <p className="text-slate-400">Professional security review and formal verification before mainnet.</p>
              </div>
            </div>

            {/* Phase 3: Mainnet Beta */}
            <div className="relative flex flex-col md:flex-row items-start mb-16">
              <div className="md:w-1/2 md:pr-16 md:text-right mb-4 md:mb-0">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full mb-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Planned</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Phase 3 — Mainnet Beta</h3>
                <p className="text-slate-400">Gated launch with whitelisted protocols and capped liquidity pools.</p>
              </div>
              <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 w-7 h-7 rounded-full bg-purple-500/50 border-4 border-[#0c1324] flex items-center justify-center z-10">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div className="md:w-1/2 md:pl-16 pl-16">
                <div className="bg-[#151b2d] p-5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400"><IconTarget className="w-4 h-4" /> Deploy to HashKey Mainnet</div>
                  <div className="flex items-center gap-2 text-sm text-slate-400"><IconTarget className="w-4 h-4" /> Integrate with 3+ DeFi protocols</div>
                  <div className="flex items-center gap-2 text-sm text-slate-400"><IconTarget className="w-4 h-4" /> $100K TVL cap for beta testing</div>
                  <div className="flex items-center gap-2 text-sm text-slate-400"><IconTarget className="w-4 h-4" /> Real-time monitoring dashboard</div>
                </div>
              </div>
            </div>

            {/* Phase 4: Full Launch */}
            <div className="relative flex flex-col md:flex-row items-start">
              <div className="md:w-1/2 md:pr-16 md:text-right mb-4 md:mb-0 md:order-1 order-2 pl-16 md:pl-0">
                <div className="bg-[#151b2d] p-5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex md:justify-end items-center gap-2 text-sm text-slate-400"><IconGlobe className="w-4 h-4" /> Multi-chain deployment (HSK + ETH)</div>
                  <div className="flex md:justify-end items-center gap-2 text-sm text-slate-400"><IconGlobe className="w-4 h-4" /> DAO governance for rescue parameters</div>
                  <div className="flex md:justify-end items-center gap-2 text-sm text-slate-400"><IconGlobe className="w-4 h-4" /> Advanced AI model (ML-based)</div>
                  <div className="flex md:justify-end items-center gap-2 text-sm text-slate-400"><IconGlobe className="w-4 h-4" /> ZKID cross-chain portability</div>
                </div>
              </div>
              <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 w-7 h-7 rounded-full bg-amber-500/50 border-4 border-[#0c1324] flex items-center justify-center z-10">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div className="md:w-1/2 md:pl-16 mb-4 md:mb-0 md:order-2 order-1">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Vision</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Phase 4 — Full Mainnet</h3>
                <p className="text-slate-400">Permissionless protocol with DAO governance and multi-chain support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] orb-cyan rounded-full blur-[120px] opacity-30"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-black mb-6">
            Ready to Experience{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Fair DeFi
            </span>
            ?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Connect your wallet and explore the APOLLO Sentinel dashboard. 
            Simulate market crashes and see how our AI protects positions in real-time.
          </p>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-teal-500 text-[#00363a] font-bold text-xl rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-105"
          >
            <span>Launch Dashboard</span>
            <IconRocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <IconShield className="w-4 h-4 text-[#00363a]" />
              </div>
              <span className="font-bold text-white">APOLLO Sentinel</span>
            </div>
            <div className="text-sm text-slate-500">
              Built for HashKey On-Chain Horizon Hackathon 2026 • DeFi + AI + ZKID Track
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/zzzbedream/Apollo-Sentinel" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <IconGithub className="w-4 h-4" />
                GitHub
              </a>
              <a href="https://hashfans.io" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                HashKey Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
