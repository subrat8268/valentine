import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Mail, Image, Gift, X } from "lucide-react";
import { randomBetween } from "../utils/prng";

interface IKnewItPageProps {
  onHeartComplete: () => void;
  onInteraction?: () => void;
}

const galleryImages = import.meta.glob(
  "../assets/gallery/*.{jpg,jpeg,png,webp,gif}",
  {
    eager: true,
    as: "url",
  },
);

const nicknameMap: Record<string, string> = {
  "gall1.jpg": "Sunshine 💛",
  "gall2.jpg": "Sweetpea 🌸",
  "gall3.jpg": "Angel Eyes ✨",
  "gall4.jpg": "Honeybee 🍯",
  "gall5.jpg": "Moonbeam 🌙",
  "gall6.jpg": "Rosebud 🌹",
  "gall7.jpg": "Starlight 🌟",
  "gall8.jpg": "Cupcake 🧁",
  "gall9.jpg": "Butterfly 🦋",
  "gall10.jpg": "Heartthrob 💖",
};

const toCaption = (filePath: string): string => {
  const fileName = filePath.split("/").pop() ?? "memory";
  return nicknameMap[fileName] ?? fileName;
};

const memories = Object.entries(galleryImages)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url], index) => ({
    id: index + 1,
    url: url as string,
    caption: toCaption(path),
  }));

type BackgroundHeart = {
  id: number;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  size: number;
  duration: number;
};

type CelebrationHeart = {
  id: number;
  x: number;
  y: number;
};

const createBackgroundHearts = (): BackgroundHeart[] =>
  Array.from({ length: 30 }, (_, id) => {
    const seed = id + 1;

    return {
      id,
      startX: `${randomBetween(seed, 0, 100)}vw`,
      startY: `${randomBetween(seed + 100, 0, 100)}vh`,
      endX: `${randomBetween(seed + 200, 0, 100)}vw`,
      endY: `${randomBetween(seed + 300, 0, 100)}vh`,
      size: randomBetween(seed + 400, 15, 40),
      duration: randomBetween(seed + 500, 15, 30),
    };
  });

const createCelebrationHearts = (): CelebrationHeart[] =>
  Array.from({ length: 30 }, (_, id) => {
    const seed = id + 1;

    return {
      id,
      x: randomBetween(seed, -200, 200),
      y: randomBetween(seed + 100, -200, 200),
    };
  });

export default function IKnewItPage({
  onHeartComplete,
  onInteraction,
}: IKnewItPageProps) {
  const backgroundHearts = useMemo(() => createBackgroundHearts(), []);
  const celebrationHearts = useMemo(() => createCelebrationHearts(), []);
  const [showLetter, setShowLetter] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<
    (typeof memories)[0] | null
  >(null);
  const [showGift, setShowGift] = useState(false);
  const [heartProgress, setHeartProgress] = useState(0);
  const [isPressingHeart, setIsPressingHeart] = useState(false);
  const letterCloseRef = useRef<HTMLButtonElement | null>(null);
  const memoriesCloseRef = useRef<HTMLButtonElement | null>(null);
  const selectedCloseRef = useRef<HTMLButtonElement | null>(null);
  const giftCloseRef = useRef<HTMLButtonElement | null>(null);
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

  useEffect(() => {
    if (!showLetter && !showMemories && !selectedMemory && !showGift) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (selectedMemory) {
        setSelectedMemory(null);
        return;
      }

      if (showMemories) {
        setShowMemories(false);
        return;
      }

      if (showLetter) {
        setShowLetter(false);
        return;
      }

      if (showGift) {
        setShowGift(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showLetter, showMemories, selectedMemory, showGift]);

  useEffect(() => {
    if (showLetter) letterCloseRef.current?.focus();
  }, [showLetter]);

  useEffect(() => {
    if (showMemories) memoriesCloseRef.current?.focus();
  }, [showMemories]);

  useEffect(() => {
    if (selectedMemory) selectedCloseRef.current?.focus();
  }, [selectedMemory]);

  useEffect(() => {
    if (showGift) giftCloseRef.current?.focus();
  }, [showGift]);

  const handleHeartPress = () => {
    setIsPressingHeart(true);
    const interval = setInterval(() => {
      setHeartProgress((prev) => {
        onInteraction?.();
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onHeartComplete(), 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const stopInterval = () => {
      clearInterval(interval);
      setIsPressingHeart(false);
    };

    window.addEventListener("mouseup", stopInterval, { once: true });
    window.addEventListener("touchend", stopInterval, { once: true });
  };

  return (
    <motion.div
      className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-peach-50 py-12 px-4 relative overflow-hidden transition-colors duration-1000"
      animate={{
        backgroundColor: heartProgress === 100 ? "#ffe4e6" : "transparent",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-pink-200 opacity-30"
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

      <motion.div
        className="absolute inset-0 pointer-events-none bg-rose-200/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: heartProgress === 100 ? 0.6 : 0 }}
        transition={{ duration: 1 }}
      />

      <motion.div
        className="max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={
          heartProgress === 100
            ? { x: [0, -3, 3, 0], y: [0, 3, -3, 0] }
            : "show"
        }
        transition={{ duration: 0.4 }}
      >
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4">
            I knew your heart would find mine. 💘
          </h1>
          <p className="text-xl md:text-2xl text-rose-400 font-light">
            You make my world softer.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.6 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer frame-stroke hover-glow"
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => setShowLetter(true)}
          >
            <div className="icon-badge icon-badge--rose">
              <Mail className="icon-badge__icon" />
            </div>
            <h3 className="text-xl font-bold text-rose-600 mb-2">
              Love Letter
            </h3>
            <p className="text-gray-600">A message from my heart</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.6 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer frame-stroke hover-glow"
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => setShowMemories(true)}
          >
            <div className="icon-badge icon-badge--gold">
              <Image className="icon-badge__icon" />
            </div>
            <h3 className="text-xl font-bold text-rose-600 mb-2">
              Memory String
            </h3>
            <p className="text-gray-600">Our moments together</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.6 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer frame-stroke hover-glow"
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => setShowGift(true)}
          >
            <div className="icon-badge icon-badge--rose">
              <Gift className="icon-badge__icon" />
            </div>
            <h3 className="text-xl font-bold text-rose-600 mb-2">Your Gift</h3>
            <p className="text-gray-600">Open for a surprise</p>
          </motion.div>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-linear-to-br from-white/80 to-pink-50/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-12"
        >
          <div className="relative bg-white/50 rounded-xl p-1 mb-6 overflow-hidden">
            <div className="flex gap-4 pb-6 overflow-x-auto">
              {memories.map((memory, i) => (
                <motion.div
                  key={memory.id}
                  className="shrink-0 cursor-pointer"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedMemory(memory)}
                >
                  <div className="bg-white p-3 rounded-lg shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                    <img
                      src={memory.url}
                      alt={`Memory ${i + 1}`}
                      className="w-40 h-40 object-cover rounded"
                    />
                    <div className="w-full h-0.5 bg-pink-300 my-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-rose-600 mb-6">
            Press and hold to fill this heart with love
          </h2>

          <div className="relative m-auto inline-block">
            <motion.div
              className="cursor-pointer"
              onMouseDown={handleHeartPress}
              onTouchStart={handleHeartPress}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: isPressingHeart ? [1, 1.2, 1] : 1 }}
              transition={{
                repeat: isPressingHeart ? Infinity : 0,
                duration: 0.5,
              }}
            >
              <Heart
                className="text-rose-500 m-auto"
                fill={heartProgress > 0 ? "#fb7185" : "none"}
                size={120}
                strokeWidth={2}
              />
            </motion.div>

            <div className="mt-6">
              <div className="w-64 bg-white/50 rounded-full h-4 overflow-hidden shadow-lg mx-auto">
                <motion.div
                  className="bg-linear-to-r from-pink-400 to-rose-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${heartProgress}%` }}
                />
              </div>
              <p className="text-rose-600 font-bold text-xl mt-2">
                {Math.floor(heartProgress)}%
              </p>
            </div>
          </div>

          {heartProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6"
            >
              {celebrationHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  className="absolute text-rose-400"
                  initial={{ x: 0, y: 0, scale: 0 }}
                  animate={{
                    x: heart.x,
                    y: heart.y,
                    scale: [0, 1, 0],
                  }}
                  transition={{ duration: 1.5 }}
                >
                  <Heart fill="currentColor" size={20} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {showLetter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowLetter(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white backdrop-blur-xl border border-white/30 p-8 md:p-12 rounded-2xl shadow-2xl max-w-2xl relative"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23fecaca' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E')",
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Love letter"
          >
            <button
              ref={letterCloseRef}
              onClick={() => setShowLetter(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close love letter"
            >
              <X size={24} />
            </button>

            <div className="font-serif">
              <h2 className="text-3xl font-bold text-rose-600 mb-6 text-center">
                My Dearest Valentine
              </h2>
              <div className="text-gray-700 space-y-4 leading-relaxed text-lg">
                <p>
                  From the moment our paths crossed, I knew something magical
                  was beginning. Your laughter became my favorite melody, and
                  your smile, the light that brightens even my darkest days.
                </p>
                <p>
                  Every moment with you feels like a dream I never want to wake
                  from. You've shown me what it means to feel truly seen,
                  understood, and cherished.
                </p>
                <p>
                  In a world full of chaos, you are my peace. In a life full of
                  questions, you are my answer. Thank you for being exactly who
                  you are.
                </p>
                <p className="text-right italic text-rose-600 mt-8">
                  Always choosing you,
                  <br />
                  Subrat 💖
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showMemories && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowMemories(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-xl border border-white/30 p-6 md:p-10 rounded-3xl shadow-2xl max-w-5xl w-full relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Memory gallery"
          >
            <button
              ref={memoriesCloseRef}
              onClick={() => setShowMemories(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close memory gallery"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-yellow-200 mb-6 text-center small-caps">
              Memory String
            </h2>

            <div className="gallery-decor" aria-hidden="true">
              <span className="gallery-heart" />
              <span className="gallery-heart" />
              <span className="gallery-heart" />
              <span className="gallery-heart" />
              <span className="gallery-heart" />
              <span className="gallery-heart" />
              <span className="gallery-star" />
              <span className="gallery-star" />
              <span className="gallery-star" />
              <span className="gallery-star" />
              <span className="gallery-star" />
              <span className="gallery-star" />
            </div>

            <div className="gallery-shelf">
              <div className="gallery-shelf__glow" aria-hidden="true" />
              <div className="gallery-shelf__rail" aria-hidden="true" />
              <div className="memory-marquee">
                <div className="memory-track">
                  {memories.concat(memories).map((memory, index) => (
                    <button
                      key={`${memory.id}-${index}`}
                      type="button"
                      className={`memory-card ${index % 3 === 1 ? "memory-card--tall" : ""}`}
                      onClick={() => {
                        setSelectedMemory(memory);
                        setShowMemories(false);
                      }}
                    >
                      <div className="memory-card__frame">
                        <img
                          src={memory.url}
                          alt={memory.caption}
                          className="memory-card__image"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <p className="memory-card__caption">{memory.caption}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="gallery-shelf__base" aria-hidden="true" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedMemory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white backdrop-blur-xl border border-white/30 p-5 md:p-8 rounded-2xl shadow-2xl w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Selected memory"
          >
            <button
              ref={selectedCloseRef}
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close selected memory"
            >
              <X size={24} />
            </button>
            <img
              src={selectedMemory.url}
              alt="Memory"
              className="w-full h-64 sm:h-80 md:h-[28rem] object-cover rounded-xl mb-4"
              decoding="async"
            />
            <p className="text-rose-600 text-xl font-semibold text-center">
              {selectedMemory.caption}
            </p>
          </motion.div>
        </motion.div>
      )}

      {showGift && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowGift(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="bg-linear-to-br from-pink-100 to-rose-100 p-12 rounded-3xl shadow-2xl text-center max-w-md relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Gift surprise"
          >
            <button
              ref={giftCloseRef}
              onClick={() => setShowGift(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close gift"
            >
              <X size={24} />
            </button>
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Gift className="text-rose-500 w-24 h-24 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-3xl font-bold text-rose-600 mb-4">
              Your real surprise is waiting for you tonight 💝
            </h3>
            <p className="text-gray-600 text-lg">
              Something special, just for you...
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
