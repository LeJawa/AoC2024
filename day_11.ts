const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_11.txt");

const startingStones: number[] = file.split(" ").map((x) => parseInt(x));

const getNumberOfDigits = (x: number) => Math.log(x) * Math.LOG10E + 1 | 0;

const addToDict = (stone: number, amount: number, dict: IStoneDict) => {
  if (dict[stone] === undefined) dict[stone] = 0;

  dict[stone] += amount;

  if (dict[stone] === 0) delete dict[stone];
  return dict;
};

const part1DoBlink = (stoneDict: IStoneDict) => {
  const old = JSON.parse(JSON.stringify(stoneDict))

  Object.keys(old).forEach((key) => {
    const amount = old[key];

    if (amount === 0) return;
    const stone = parseInt(key);

    stoneDict = addToDict(stone, -amount, stoneDict);
    if (stone === 0) stoneDict = addToDict(1, amount, stoneDict);
    else {
      const stoneDigits = getNumberOfDigits(stone);
      if (stoneDigits % 2 === 1) {
        stoneDict = addToDict(stone * 2024, amount, stoneDict);
      } else {
        const halfDivisor = 10 ** (stoneDigits / 2);
        stoneDict = addToDict(
          Math.trunc(stone / halfDivisor),
          amount,
          stoneDict,
        );
        stoneDict = addToDict(stone % halfDivisor, amount, stoneDict);
      }
    }
  });
  return stoneDict;
};

interface IStoneDict {
  [n: string]: number;
}

const part1DoNBlinks = (stones: number[], n: number) => {
  let blink = 0;
  let stoneDict: IStoneDict = {};
  stones.forEach((stone) => stoneDict[stone] = 1);

  while (blink < n) {
    stoneDict = part1DoBlink(stoneDict);
    blink++;
    // console.log(blink, stones.length);
  }

  return Object.keys(stoneDict).reduce((prev, curr) => {
    return prev += stoneDict[curr];
  });
};

const calculatePart1 = (stones: number[]) => {
  const totalBlinks = 25;
  return part1DoNBlinks(stones, totalBlinks);
};

const calculatePart2 = (stones: number[]) => {
  const totalBlinks = 75;
  return part1DoNBlinks(stones, totalBlinks);
};

const t1 = performance.now();
const part1Stones = calculatePart1(startingStones.slice());
const part1 = part1Stones.length;
const t2 = performance.now();
const part2Stones = calculatePart2(startingStones.slice());
const part2 = part2Stones.length;
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 231278
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
