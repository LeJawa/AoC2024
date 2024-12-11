const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_11.txt");

const startingStones: number[] = file.split(" ").map((x) => parseInt(x));

const doBlink = (stone: number) => {
  if (stone === 0) return [1];

  const stringStone = stone.toString();
  if (stringStone.length % 2 === 1) return [stone * 2024];

  const half = stringStone.length / 2;
  return [
    parseInt(stringStone.slice(0, half)),
    parseInt(stringStone.slice(half)),
  ];
};

const doNBlinks = (stone: number, n: number) => {
  if (n === 0) return 1;
  let stoneNumber = 0;

  const stones = doBlink(stone);
  stones.forEach((newStone) => {
    stoneNumber += doNBlinks(newStone, n - 1);
  });

  return stoneNumber;
};

const calculatePart1 = (stones: number[]) => {
  const totalBlinks = 25;
  let stoneNumber = 0;
  stones.forEach((stone) => {
    stoneNumber += doNBlinks(stone, totalBlinks);
  });
  return stoneNumber;
};

const calculatePart2 = (stones: number[]) => {
  const totalBlinks = 75;
  let stoneNumber = 0;
  stones.forEach((stone) => {
    stoneNumber += doNBlinks(stone, totalBlinks);
    console.log(`Stones counted ${stoneNumber}`);
  });
  return stoneNumber;
};

const t1 = performance.now();
const part1 = calculatePart1(startingStones.slice());
const t2 = performance.now();
const part2 = calculatePart2(startingStones.slice());
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 231278
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
