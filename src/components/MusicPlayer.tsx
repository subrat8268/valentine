import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import musicUrl from "../assets/lover.mp3";

export default function MusicPlayer() {
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTapToPlay, setShowTapToPlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const forcePlay = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.muted = false;
    audio.volume = Math.max(audio.volume, 0.5);
    audio.play().catch(() => {
      setShowTapToPlay(true);
    });
  };

  const startFadeIn = () => {
    if (!audioRef.current) return;

    if (fadeRef.current) clearInterval(fadeRef.current);

    const audio = audioRef.current;
    audio.muted = false;
    audio.volume = 0;
    audio.play().catch(() => {
      setShowTapToPlay(true);
    });

    let volume = 0;
    fadeRef.current = setInterval(() => {
      volume = Math.min(volume + 0.05, 0.5);
      audio.volume = volume;
      if (volume >= 0.5 && fadeRef.current) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, 200);
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        if (isMuted) setIsMuted(false);
        startFadeIn();
        window.setTimeout(forcePlay, 400);
        setShowTapToPlay(false);
      }
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("pointerdown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("pointerdown", handleInteraction);
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, [hasInteracted, isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      audioRef.current.muted = nextMuted;

      if (!nextMuted) {
        startFadeIn();
        window.setTimeout(forcePlay, 200);
        setShowTapToPlay(false);
      } else if (fadeRef.current) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      }

      if (!hasInteracted) setHasInteracted(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        preload="auto"
        playsInline
        onCanPlay={() => {
          if (hasInteracted && !isMuted) forcePlay();
        }}
        src={musicUrl}
      />

      {showTapToPlay && (
        <button
          onClick={() => {
            setHasInteracted(true);
            setIsMuted(false);
            startFadeIn();
            window.setTimeout(forcePlay, 200);
            setShowTapToPlay(false);
          }}
          className="fixed bottom-24 right-6 z-50 rounded-full bg-rose-500 text-white px-4 py-2 text-sm font-semibold shadow-lg"
        >
          Tap to play music
        </button>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMuted ? (
          <VolumeX className="text-rose-500 w-6 h-6" />
        ) : (
          <Volume2 className="text-rose-500 w-6 h-6" />
        )}
      </motion.button>
    </>
  );
}
