import { useEffect, useMemo, useRef, useState } from "react";
import { randomBetween } from "../utils/prng";

interface GlobalEffectsProps {
  name: string;
  photoUrl: string;
  sparkleIntensity?: "very-subtle" | "subtle" | "noticeable";
}

type FloatingName = {
  id: number;
  x: string;
  y: string;
  delay: number;
  scale: number;
  opacity: number;
};

type CursorHeart = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
};

const createFloatingNames = (name: string): FloatingName[] =>
  Array.from({ length: 6 }, (_, id) => {
    const seed = id + 1;

    return {
      id,
      x: `${randomBetween(seed, 5, 95)}vw`,
      y: `${randomBetween(seed + 100, 5, 95)}vh`,
      delay: randomBetween(seed + 200, 0, 6),
      scale: randomBetween(seed + 300, 0.9, 1.2),
      opacity: randomBetween(seed + 400, 0.08, 0.18),
    };
  });

const getSparkleInterval = (
  intensity: GlobalEffectsProps["sparkleIntensity"],
): number => {
  switch (intensity) {
    case "very-subtle":
      return 120;
    case "noticeable":
      return 24;
    default:
      return 40;
  }
};

const getSparkleSize = (
  intensity: GlobalEffectsProps["sparkleIntensity"],
  seed: number,
): number => {
  switch (intensity) {
    case "very-subtle":
      return randomBetween(seed, 6, 12);
    case "noticeable":
      return randomBetween(seed, 12, 26);
    default:
      return randomBetween(seed, 10, 20);
  }
};

export default function GlobalEffects({
  name,
  photoUrl,
  sparkleIntensity = "subtle",
}: GlobalEffectsProps) {
  const floatingNames = useMemo(() => createFloatingNames(name), [name]);
  const [cursorHearts, setCursorHearts] = useState<CursorHeart[]>([]);
  const heartIdRef = useRef(0);
  const heartSeedRef = useRef(1);
  const lastHeartRef = useRef(0);

  useEffect(() => {
    const interval = getSparkleInterval(sparkleIntensity);

    const handleMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastHeartRef.current < interval) return;
      lastHeartRef.current = now;

      const seed = heartSeedRef.current++;
      const size = getSparkleSize(sparkleIntensity, seed);
      const id = heartIdRef.current++;
      const rotate = randomBetween(seed + 50, -30, 30);
      const opacity = randomBetween(seed + 100, 0.5, 0.9);

      setCursorHearts((prev) => [
        ...prev.slice(-50),
        { id, x: event.clientX, y: event.clientY, size, rotate, opacity },
      ]);

      window.setTimeout(() => {
        setCursorHearts((prev) => prev.filter((heart) => heart.id !== id));
      }, 1000);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [sparkleIntensity]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 glow-border" />

      <div className="absolute inset-0">
        {floatingNames.map((item) => (
          <span
            key={item.id}
            className="floating-name"
            style={{
              left: item.x,
              top: item.y,
              animationDelay: `${item.delay}s`,
              opacity: item.opacity,
              transform: `translate(-50%, -50%) scale(${item.scale})`,
            }}
          >
            {name}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="heart-photo"
          style={{ backgroundImage: `url(${photoUrl})` }}
        />
      </div>

      <div className="absolute inset-0">
        {cursorHearts.map((heart) => (
          <span
            key={heart.id}
            className="cursor-heart"
            style={{
              left: heart.x,
              top: heart.y,
              width: heart.size,
              height: heart.size,
              opacity: heart.opacity,
              transform: `translate(-50%, -50%) rotate(${heart.rotate}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
