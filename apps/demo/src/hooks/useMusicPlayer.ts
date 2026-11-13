
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AUDIO_CONFIG } from "../lib/constants";
import type { AudioState } from "../types";

export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    volume: AUDIO_CONFIG.defaultVolume,
    isMuted: false,
    isLooping: true,
    isLoaded: false,
    hasError: false,
    errorMessage: null,
    duration: 0,
    currentTime: 0
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(AUDIO_CONFIG.src);
    audio.loop = true;
    audio.volume = state.volume;
    audio.preload = "auto";
    audioRef.current = audio;
    if (typeof window !== "undefined") {
      (window as any).__audioInstance = audio;
    }

    const handleReady = () => {
      setState((prev) => ({
        ...prev,
        isLoaded: true,
        hasError: false,
        errorMessage: null,
        duration: audio.duration || 0
      }));
    };

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || prev.duration
      }));
    };

    const handleError = () => {
      console.warn("Audio loading notice: /audio/snowman.mp3 not ready yet.");
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        hasError: true,
        errorMessage:
          "Audio track is preparing or waiting for interaction."
      }));
    };

    const handleEnded = () => {
      if (!audio.loop) {
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
    };

    audio.addEventListener("loadedmetadata", handleReady);
    audio.addEventListener("canplay", handleReady);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleReady);
      audio.removeEventListener("canplay", handleReady);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, []);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;

    if (state.isPlaying) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      try {
        if (state.hasError || !state.isLoaded) {
          audioRef.current.load();
        }
        await audioRef.current.play();
        setState((prev) => ({
          ...prev,
          isPlaying: true,
          hasError: false,
          errorMessage: null
        }));
      } catch (err: unknown) {
        console.error("Playback error:", err);
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          hasError: true,
          errorMessage:
            "Click anywhere or tap Play to allow browser audio playback."
        }));
      }
    }
  }, [state.isPlaying, state.hasError, state.isLoaded]);

  const setVolume = useCallback((newVolume: number) => {
    if (!audioRef.current) return;
    const vol = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = vol;
    audioRef.current.muted = vol === 0;
    setState((prev) => ({
      ...prev,
      volume: vol,
      isMuted: vol === 0
    }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const nextMuted = !state.isMuted;
    audioRef.current.muted = nextMuted;
    setState((prev) => ({ ...prev, isMuted: nextMuted }));
  }, [state.isMuted]);

  const toggleLoop = useCallback(() => {
    if (!audioRef.current) return;
    const nextLoop = !state.isLooping;
    audioRef.current.loop = nextLoop;
    setState((prev) => ({ ...prev, isLooping: nextLoop }));
  }, [state.isLooping]);

  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current) return;
      const targetTime = Math.max(0, Math.min(state.duration || 0, time));
      audioRef.current.currentTime = targetTime;
      setState((prev) => ({ ...prev, currentTime: targetTime }));
    },
    [state.duration]
  );

  return {
    ...state,
    title: AUDIO_CONFIG.title,
    artist: AUDIO_CONFIG.artist,
    album: AUDIO_CONFIG.album,
    togglePlay,
    setVolume,
    toggleMute,
    toggleLoop,
    seek
  };
}
