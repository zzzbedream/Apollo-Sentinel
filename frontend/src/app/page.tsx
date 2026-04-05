import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c1324] text-[#dce1fb]">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <span className="text-xl">🛡</span>
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
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-[#00363a] font-bold text-sm rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
            >
              Launch App
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 pt-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 hero-gradient pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#151b2d] rounded-full mb-8 border border-cyan-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              HashKey On-Chain Horizon Hackathon
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            <span className="text-white">Stop Punishing</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Users
            </span>
            <br />
            <span className="text-white">For Market</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Volatility
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            APOLLO Sentinel is an AI-powered DeFi guardian that prevents destructive liquidations 
            through Just-In-Time rescues and ZKID-verified creditworthiness.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-[#00363a] font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Launch App
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <a
              href="https://github.com/apollo-sentinel"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#151b2d] border border-slate-700 text-white font-semibold text-lg rounded-xl hover:bg-[#191f31] transition-colors"
            >
              View on GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-slate-800">
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
            <div className="bg-[#151b2d] p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Oracle Engine</h3>
              <p className="text-slate-400 leading-relaxed">
                Real-time health factor monitoring with predictive liquidation detection. 
                Our AI evaluates risk 24/7 and executes autonomous decisions on HashKey Chain.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#151b2d] p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold mb-3">ZKID Soulbound Tokens</h3>
              <p className="text-slate-400 leading-relaxed">
                Verifiable creditworthiness credentials stored as non-transferable tokens. 
                Prove your track record without exposing sensitive financial data.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#151b2d] p-8 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <span className="text-2xl">⚡</span>
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
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <span className="text-cyan-400">✓</span>
                  </div>
                  <span className="text-slate-300">EVM-compatible Smart Contracts</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <span className="text-cyan-400">✓</span>
                  </div>
                  <span className="text-slate-300">Serverless AI Oracle (Next.js API Routes)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <span className="text-cyan-400">✓</span>
                  </div>
                  <span className="text-slate-300">Ethers v6 Transaction Signing</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <span className="text-cyan-400">✓</span>
                  </div>
                  <span className="text-slate-300">Wagmi + Viem for Frontend Integration</span>
                </div>
              </div>
            </div>
            <div className="bg-[#151b2d] p-8 rounded-2xl border border-slate-800">
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

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
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
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-teal-500 text-[#00363a] font-bold text-xl rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 transition-all transform hover:scale-105"
          >
            <span>Launch Dashboard</span>
            <span className="text-2xl">🚀</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <span className="text-sm">🛡</span>
              </div>
              <span className="font-bold text-white">APOLLO Sentinel</span>
            </div>
            <div className="text-sm text-slate-500">
              Built for HashKey On-Chain Horizon Hackathon 2026 • DeFi + AI + ZKID Track
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/apollo-sentinel" className="text-slate-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="https://hashfans.io" className="text-slate-400 hover:text-white transition-colors">
                HashKey Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
