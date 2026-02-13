import { motion } from "framer-motion";
import { useMemo } from "react";
import { Heart, X } from "lucide-react";
import { randomBetween } from "../utils/prng";

interface EasterEggProps {
  onClose: () => void;
}

type SparkleHeart = {
  id: number;
  x: string;
  y: string;
  rotate: number;
};

const createSparkleHearts = (): SparkleHeart[] =>
  Array.from({ length: 15 }, (_, id) => {
    const seed = id + 1;

    return {
      id,
      x: `${randomBetween(seed, 0, 100)}%`,
      y: `${randomBetween(seed + 100, 0, 100)}%`,
      rotate: randomBetween(seed + 200, 0, 360),
    };
  });

export default function EasterEgg({ onClose }: EasterEggProps) {
  const sparkleHearts = useMemo(() => createSparkleHearts(), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-linear-to-br from-pink-100 via-rose-100 to-amber-100 p-10 md:p-16 rounded-3xl shadow-2xl text-center max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mb-6"
        >
          <Heart
            className="text-rose-500 w-20 h-20 mx-auto"
            fill="currentColor"
          />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-rose-600 mb-6">
          Bonus Love Unlocked 💌
        </h2>

        <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8">
          You found the secret because you're curious…
          <br />
          <span className="text-rose-600 font-semibold">
            And that's one of the reasons I adore you.
          </span>
        </p>

        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {sparkleHearts.map((heart, i) => (
            <motion.div
              key={heart.id}
              className="absolute text-rose-300"
              initial={{
                x: heart.x,
                y: heart.y,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: heart.rotate,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <Heart fill="currentColor" size={15} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
