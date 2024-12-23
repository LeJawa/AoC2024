const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_22.txt");

const startingNumbers = file.split("\n").map((x) => BigInt(x));

const nextNumber = (n: bigint) => {
  let newNumber = prune(mix(n, n * 64n));
  newNumber = prune(mix(newNumber, BigInt(Math.trunc(Number(newNumber) / 32))));
  newNumber = prune(mix(newNumber, newNumber * 2048n));
  return newNumber;
};

const mix = (a: bigint, b: bigint) => {
  return a ^ b;
};

const prune = (n: bigint) => n % 16777216n;

const calculatePart1 = () => {
  return startingNumbers
    .map((n) => {
      let newN = n;
      for (let i = 0; i < 2000; i++) {
        newN = nextNumber(newN);
      }
      return newN;
    })
    .reduce((sum, n) => sum + n, 0n);
};

const calculatePart2 = () => {};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 16039090236
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
