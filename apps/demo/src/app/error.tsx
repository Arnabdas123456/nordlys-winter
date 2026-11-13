"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Nordlys caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06101f] text-white p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-white/10 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-emerald-200 mb-2">Winter Calm Interrupted</h2>
        <p className="text-sm text-cyan-100/80 mb-6">
          A frost glitch occurred while rendering the Northern Lights sky.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Rekindle the Sky</span>
        </button>
      </div>
    </div>
  );
}
