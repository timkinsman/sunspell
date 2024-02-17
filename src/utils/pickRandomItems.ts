export function pickRandomItems<T>(array: T[], count: number): T[] {
  const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
  return shuffledArray.slice(0, count);
}
