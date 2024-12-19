const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_19.txt");

const towels = file.split("\n")[0].split(", ");
const patterns = file.split("\n").slice(2);

const possiblePatterns = (patterns: string[], towels: string[]) => {
  const possible: string[] = [];

  const towelRegex = new RegExp(`^(?:${towels.join("|")})+$`);

  patterns.forEach((pattern) => {
    if (towelRegex.exec(pattern)) possible.push(pattern);
  });

  return possible;
};

const calculatePart1 = () => {
  const possible = possiblePatterns(patterns, towels);

  return possible.length;
};

const calculatePart2 = () => {
  const possible = possiblePatterns(patterns, towels);
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 242
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
