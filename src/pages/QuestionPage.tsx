import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { randomBetween } from "../utils/prng";

interface QuestionPageProps {
  onYes: () => void;
  onInteraction?: () => void;
}

const noMessages = [
  "Are you sure?",
  "But we look cute together...",
  "This is illegal.",
  "Try again sweetheart.",
];

type FloatingHeart = {
  id: number;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  size: number;
  duration: number;
};

type ConfettiPiece = {
  id: number;
  x: string;
  y: string;
  rotate: number;
};

const createFloatingHearts = (): FloatingHeart[] =>
  Array.from({ length: 15 }, (_, id) => {
    const seed = id + 1;

    return {
      id,
      startX: `${randomBetween(seed, 0, 100)}vw`,
      startY: `${randomBetween(seed + 100, 0, 100)}vh`,
      endX: `${randomBetween(seed + 200, 0, 100)}vw`,
      endY: `${randomBetween(seed + 300, 0, 100)}vh`,
      size: randomBetween(seed + 400, 20, 50),
      duration: randomBetween(seed + 500, 10, 20),
    };
  });

export default function QuestionPage({
  onYes,
  onInteraction,
}: QuestionPageProps) {
  const floatingHearts = useMemo(() => createFloatingHearts(), []);
  const [noClicks, setNoClicks] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [noMessage, setNoMessage] = useState("");
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [confettiSeed, setConfettiSeed] = useState(0);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  const handleNoClick = () => {
    onInteraction?.();
    const nextClicks = noClicks + 1;
    setNoClicks(nextClicks);
    setNoMessage(noMessages[(nextClicks - 1) % noMessages.length]);

    const randomX = randomBetween(nextClicks, -50, 50);
    const randomY = randomBetween(nextClicks + 50, -50, 50);
    setNoPosition({ x: randomX, y: randomY });

    setTimeout(() => setNoMessage(""), 2000);
  };

  const handleYesClick = () => {
    onInteraction?.();
    const nextSeed = confettiSeed + 1;
    setConfettiSeed(nextSeed);
    setConfetti(
      Array.from({ length: 50 }, (_, id) => {
        const seed = nextSeed * 1000 + id;

        return {
          id,
          x: `${randomBetween(seed, 0, 100)}vw`,
          y: `${randomBetween(seed + 100, 0, 100)}vh`,
          rotate: randomBetween(seed + 200, 0, 360),
        };
      }),
    );
    setShowConfetti(true);
    setTimeout(() => onYes(), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-rose-100 to-peach-100 flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-pink-300 opacity-20"
            initial={{
              x: heart.startX,
              y: heart.startY,
            }}
            animate={{
              y: [null, heart.endY],
              x: [null, heart.endX],
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

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute text-rose-400"
              initial={{
                x: "50vw",
                y: "50vh",
                scale: 0,
              }}
              animate={{
                x: piece.x,
                y: piece.y,
                scale: [0, 1, 0],
                rotate: piece.rotate,
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
            >
              <Heart fill="currentColor" size={20} />
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        className="text-center z-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8 frame-stroke"
        >
          <img
            src="/src/assets/teddy.gif"
            alt="Teddy Bear"
            className="w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full object-cover shadow-2xl"
          />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold text-rose-600 mb-12"
          transition={{ duration: 0.6 }}
        >
          Will you make my heart your home? 💖
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="flex gap-6 justify-center items-center flex-wrap"
        >
          <motion.button
            onClick={handleYesClick}
            className="bg-linear-to-r cursor-pointer from-pink-500 to-rose-500 text-white px-12 py-4 rounded-full text-xl md:text-2xl font-bold shadow-xl hover:shadow-2xl transition-all hover-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: 1 + noClicks * 0.1 }}
          >
            YES, FOREVER 💘
          </motion.button>

          <motion.button
            onClick={handleNoClick}
            className="bg-gray-200 cursor-pointer text-gray-700 px-12 py-4 rounded-full text-xl md:text-2xl font-bold shadow-xl hover:shadow-2xl transition-all relative hover-glow"
            animate={{
              x: noPosition.x,
              y: noPosition.y,
              scale: noClicks > 0 ? 0.9 : 1,
            }}
            transition={{ type: "spring", stiffness: 300 }}
            whileHover={{ scale: 0.95 }}
          >
            Not yet 🙈
          </motion.button>
        </motion.div>

        {noMessage && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-rose-500 text-xl mt-8 font-semibold"
          >
            {noMessage}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
