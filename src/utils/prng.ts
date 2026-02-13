export const pseudoRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const randomBetween = (seed: number, min: number, max: number): number =>
  min + pseudoRandom(seed) * (max - min);
