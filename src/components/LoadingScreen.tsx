import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { randomBetween } from "../utils/prng";

interface LoadingScreenProps {
  onComplete: () => void;
}

const loadingMessages = [
  "Tuning our heartbeats...",
  "Aligning our stars...",
  "Counting shared smiles...",
  "Measuring hug intensity...",
  "Sealing the love story...",
];

type HeartSpec = {
  id: number;
  x: string;
  size: number;
  duration: number;
  drift: string;
};

const createHearts = (): HeartSpec[] =>
  Array.from({ length: 20 }, (_, id) => {
    const seed = id + 1;

    return {
      id,
      x: `${randomBetween(seed, 0, 100)}vw`,
      size: randomBetween(seed + 100, 10, 30),
      duration: randomBetween(seed + 200, 5, 10),
      drift: `${randomBetween(seed + 300, 0, 100)}vw`,
    };
  });

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const hearts = useMemo(() => createHearts(), []);

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(timer);
          setTimeout(() => setShowResult(true), 500);
          setTimeout(() => onComplete(), 2500);
          return 99;
        }
        return Math.min(prev + increment, 99);
      });
    }, interval);

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-linear-to-br from-pink-200 via-rose-200 to-peach-200 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-pink-400 opacity-30"
            initial={{
              x: heart.x,
              y: -50,
            }}
            animate={{
              y: "110vh",
              x: heart.drift,
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Heart fill="currentColor" size={heart.size} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-rose-600 mb-8">
            Calibrating our love frequency...
          </h1>
        </motion.div>

        <div className="w-80 max-w-full mx-auto mb-6">
          <div className="bg-white/50 backdrop-blur-sm rounded-full h-6 overflow-hidden shadow-lg">
            <motion.div
              className="bg-linear-to-r from-pink-400 to-rose-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <motion.p
            className="text-rose-600 font-semibold mt-2 text-xl"
            key={progress}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.floor(progress)}%
          </motion.p>
        </div>

        <motion.p
          className="text-rose-500 text-lg mb-8 h-8"
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {loadingMessages[messageIndex]}
        </motion.p>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-2xl md:text-3xl font-bold text-rose-600 bg-white/80 backdrop-blur-sm py-4 px-8 rounded-2xl shadow-xl"
          >
            Result: 100% Perfect Match 💖
          </motion.div>
        )}
      </div>
    </div>
  );
}
