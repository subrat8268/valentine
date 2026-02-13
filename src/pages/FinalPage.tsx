import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Heart } from "lucide-react";
import { randomBetween } from "../utils/prng";

const destinyLines = [
  "You didn't just click yes.",
  "You unlocked our story.",
  "In every timeline…",
  "I choose you.",
];

interface FinalPageProps {
  interactionScore?: number;
}

type BackgroundHeart = {
  id: number;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  size: number;
  duration: number;
};

const createBackgroundHearts = (): BackgroundHeart[] =>
  Array.from({ length: 25 }, (_, id) => {
    const seed = id + 1;

    return {
      id,
      startX: `${randomBetween(seed, 0, 100)}vw`,
      startY: `${randomBetween(seed + 100, 0, 100)}vh`,
      endX: `${randomBetween(seed + 200, 0, 100)}vw`,
      endY: `${randomBetween(seed + 300, 0, 100)}vh`,
      size: randomBetween(seed + 400, 20, 50),
      duration: randomBetween(seed + 500, 20, 40),
    };
  });

export default function FinalPage({ interactionScore = 0 }: FinalPageProps) {
  const backgroundHearts = useMemo(() => createBackgroundHearts(), []);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
  const name = "For Hetal";
  const destinyPercent = Math.min(99 + interactionScore * 0.1, 99.9);
  const destinyReport = `Destiny Prediction Report:
Based on emotional compatibility, shared laughter,
and uncontrollable smiling —
Probability of Forever: ${destinyPercent.toFixed(1)}%
Margin of error: 0.1% (only if snacks are not shared).`;

  useEffect(() => {
    const lineTimers = destinyLines.map((_, index) =>
      setTimeout(() => {
        setVisibleLines(index + 1);
      }, index * 1500),
    );

    setTimeout(
      () => {
        setIsTyping(true);
      },
      destinyLines.length * 1500 + 500,
    );

    return () => lineTimers.forEach((timer) => clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (isTyping && typedText.length < destinyReport.length) {
      const timer = setTimeout(() => {
        setTypedText(destinyReport.slice(0, typedText.length + 1));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isTyping, typedText, destinyReport]);

  useEffect(() => {
    if (typedText.length > 0) return;

    const fallbackTimer = setTimeout(() => {
      setIsTyping(true);
      setTypedText(destinyReport);
    }, 9000);

    return () => clearTimeout(fallbackTimer);
  }, [typedText.length, destinyReport]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 20;
      const y = (event.clientY / window.innerHeight - 0.5) * 20;
      const background = document.getElementById("parallax-bg");
      if (background) {
        background.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-amber-100 animate-gradient">
      <div
        id="parallax-bg"
        className="absolute inset-0 overflow-hidden pointer-events-none transition-transform duration-300 ease-out"
      >
        {backgroundHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-pink-200 opacity-20"
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
        className="max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="final-ribbon">
            <span className="final-ribbon__text small-caps">
              Valentine's Finale
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-semibold text-rose-500 tracking-wide whitespace-pre">
            {name.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h2>
        </motion.div>

        <motion.div
          className="text-center space-y-8 mb-16"
          variants={itemVariants}
        >
          {destinyLines.map((line, index) => (
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: visibleLines > index ? 1 : 0,
                y: visibleLines > index ? 0 : 30,
              }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-bold text-rose-600"
            >
              {line}
            </motion.h1>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.6 }}
          className="bg-white backdrop-blur-xl border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl mb-16 frame-stroke hover-glow"
        >
          <div className="border-l-4 border-rose-400 pl-6">
            <h2 className="text-2xl md:text-3xl font-bold text-rose-600 mb-6">
              AI-Style Destiny Prediction
            </h2>
            <pre className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-sans">
              {typedText.length > 0
                ? typedText
                : "Preparing your destiny report..."}
              {isTyping && typedText.length < destinyReport.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-0.5 h-6 bg-rose-500 ml-1"
                />
              )}
            </pre>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-rose-600 mb-8">
            One last surprise…
          </h2>

          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="bg-white backdrop-blur-xl border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl inline-block frame-stroke hover-glow"
          >
            <div className="mb-6">
              <QRCodeSVG
                value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                size={200}
                bgColor="#ffffff"
                fgColor="#fb7185"
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            </div>
            <p className="text-rose-500 text-xl font-semibold">
              Scan this for something special 💝
            </p>
            <p className="text-gray-500 text-sm mt-2">
              (Update the QR code link to your surprise!)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <p className="text-2xl md:text-3xl font-bold text-rose-600">
              Happy Valentine's Day 💖
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
