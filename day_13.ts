const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_13.txt");

const matches = Array.from(
  file.matchAll(
    /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g,
  ).map((
    [_, xa, ya, xb, yb, xt, yt],
  ) => [
    parseInt(xa),
    parseInt(ya),
    parseInt(xb),
    parseInt(yb),
    parseInt(xt),
    parseInt(yt),
  ]),
);

const getNecessarytokens = ([xa, ya, xb, yb, xt, yt]: number[]) => {
  const b = (yt - ya * xt / xa) / (yb - ya * xb / xa);
  const a = (xt - b * xb) / xa;
  if (
    parseFloat(b.toFixed(3)) === Math.round(b) &&
    parseFloat(a.toFixed(3)) === Math.round(a)
  ) {
    return a * 3 + b;
  } else return 0;
};

const calculatePart1 = () => {
  let totalTokens = 0;
  matches.forEach((match) => {
    const tokens = getNecessarytokens(match);
    totalTokens += tokens;
  });

  return totalTokens;
};

const calculatePart2 = () => {
  let totalTokens = 0;
  matches.forEach(([xa, ya, xb, yb, xt, yt]) => {
    const tokens = getNecessarytokens([
      xa,
      ya,
      xb,
      yb,
      xt + 10000000000000,
      yt + 10000000000000,
    ]);
    totalTokens += tokens;
  });

  return totalTokens;
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 36870
console.log(`Part 2: ${part2}`); // 78101482023732

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
