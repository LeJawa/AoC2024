const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_19.txt");

const towels = file.split("\n")[0].split(", ");
const patterns = file.split("\n").slice(2);

const possiblePatternsRegex = (patterns: string[], towels: string[]) => {
  const possible: string[] = [];

  const towelRegex = new RegExp(`^(?:${towels.join("|")})+$`);

  patterns.forEach((pattern) => {
    if (towelRegex.exec(pattern)) possible.push(pattern);
  });

  return possible;
};

const towelDict: { [letter: string]: string[] } = {};

towels.forEach((towel) => {
  const letter = towel[0];

  if (towelDict[letter] === undefined) towelDict[letter] = [];

  towelDict[letter].push(towel);
});

const knownCombinations: { [pattern: string]: number } = {};

const recursiveFind = (pattern: string) => {
  if (pattern === "") return 1;

  if (knownCombinations[pattern] !== undefined) {
    return knownCombinations[pattern];
  }

  let combinations = 0;

  towelDict[pattern[0]].forEach((towel) => {
    if (pattern.startsWith(towel)) {
      const subcombinations = recursiveFind(pattern.slice(towel.length));

      if (subcombinations > 0) {
        if (knownCombinations[pattern] === undefined) {
          knownCombinations[pattern] = 0;
        }
        knownCombinations[pattern] += subcombinations;
      }
      combinations += subcombinations;
    }
  });

  return combinations;
};

const calculatePart1 = () => {
  const possible = possiblePatternsRegex(patterns, towels);

  return possible.length;
};

const calculatePart2 = () => {
  let combinations = 0;

  patterns.forEach((pattern) => {
    combinations += recursiveFind(pattern);
  });

  return combinations;
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 242
console.log(`Part 2: ${part2}`); // 595975512785325

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
