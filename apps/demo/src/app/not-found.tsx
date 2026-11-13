import Link from "next/link";
import { Snowflake, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#06101f] text-white p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4 border border-emerald-400/30">
        <Snowflake className="w-8 h-8 animate-spin" style={{ animationDuration: "10s" }} />
      </div>
      <h1 className="text-4xl font-extrabold text-emerald-200 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-white mb-3">Lost Beneath Arctic Skies</h2>
      <p className="text-sm text-cyan-100/80 max-w-sm mb-6">
        The winter path you are seeking is hidden beneath fresh Norwegian snow.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg"
      >
        <Home className="w-4 h-4" />
        <span>Return to Nordlys</span>
      </Link>
    </div>
  );
}
