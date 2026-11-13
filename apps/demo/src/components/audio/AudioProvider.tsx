"use client";

import React, { createContext, useContext } from "react";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";

type AudioContextType = ReturnType<typeof useMusicPlayer>;

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const music = useMusicPlayer();
  return <AudioContext.Provider value={music}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return ctx;
}

