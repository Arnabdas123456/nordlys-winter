import React from "react";

export function Footer() {
  return (
    <footer className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto text-center select-none w-auto max-w-[95vw]">
      <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#06101f]/80 backdrop-blur-md border border-cyan-300/20 shadow-lg shadow-black/50 whitespace-nowrap">
        <span className="text-[#25E5D1] text-[11px] sm:text-xs animate-pulse">❄</span>
        <p className="text-[11px] sm:text-sm text-slate-100/90 font-medium tracking-wide">
          Where the Northern Lights come alive · <span className="font-bold text-emerald-300">Nordlys</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;