import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="text-center mb-12 animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm mb-4">
          🛡 StarShield AI
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Select your intelligence layer to proceed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl animate-[fadeIn_0.7s_ease-out]">
        {/* User Dashboard Card */}
        <Link href="/user" className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <span className="text-4xl mb-4 block">🧍</span>
            <h2 className="text-2xl font-bold text-slate-200 mb-2 group-hover:text-blue-400 transition-colors">User Dashboard</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Streamlined alert interface for moderators and analysts. Focuses on clear threat levels, quick scans, and immediate risk mitigation.
            </p>
            <div className="flex items-center text-blue-400 text-sm font-semibold">
              Enter User Mode <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </Link>

        {/* Enterprise Dashboard Card */}
        <Link href="/enterprise" className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <span className="text-4xl mb-4 block">🏢</span>
            <h2 className="text-2xl font-bold text-slate-200 mb-2 group-hover:text-purple-400 transition-colors">Enterprise Console</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Deep-dive SOC-grade threat intelligence. Features semantic edge analysis, graph topology breakdowns, and explainable AI metrics.
            </p>
            <div className="flex items-center text-purple-400 text-sm font-semibold">
              Enter Enterprise Mode <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}