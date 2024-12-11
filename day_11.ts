const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_11.txt");

const startingStones: number[] = file.split(" ").map((x) => parseInt(x));

const doBlink = (stones: number[]) => {
  const newStones: number[] = [];
  stones.forEach((stone, i, arr) => {
    if (stone === 0) arr[i] = 1;
    else {
      const stringStone = stone.toString();
      if (stringStone.length % 2 === 1) {
        arr[i] *= 2024;
      } else {
        const half = stringStone.length / 2;
        arr[i] = parseInt(stringStone.slice(0, half));
        newStones.push(parseInt(stringStone.slice(half)));
      }
    }
  });
  stones = stones.concat(newStones);
  return stones;
};

const doNBlinks = (stones: number[], n: number) => {
  let blink = 0;

  while (blink < n) {
    stones = doBlink(stones);
    blink++;
    console.log(blink, stones.length);
  }

  return stones;
};

const calculatePart1 = (stones: number[]) => {
  const totalBlinks = 25;
  return doNBlinks(stones, totalBlinks);
};

const calculatePart2 = (stones: number[]) => {
  const totalBlinks = 75;
  return doNBlinks(stones, totalBlinks);
};

const t1 = performance.now();
const part1Stones = calculatePart1(startingStones.slice());
const part1 = part1Stones.length;
const t2 = performance.now();
const part2Stones = calculatePart2(startingStones.slice());
const part2 = part2Stones.length;
const t3 = performance.now();

console.log(`Part 1: ${part1}`); //
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
