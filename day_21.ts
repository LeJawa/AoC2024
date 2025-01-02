const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_21.txt");

const targetCodes = file.split("\n");

type Direction = "^" | ">" | "v" | "<";
type Directional = "A" | Direction;

const directionalPad = {
  "A": { "^": "#", ">": "#", "v": ">", "<": "^" },
  "^": { "^": "#", ">": "A", "v": "v", "<": "#" },
  ">": { "^": "A", ">": "#", "v": "#", "<": "v" },
  "v": { "^": "^", ">": ">", "v": "#", "<": "<" },
  "<": { "^": "#", ">": "v", "v": "#", "<": "#" },
};

type Numerical =
  | "A"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";

const numericalPad = {
  "A": { "^": "3", ">": "#", "v": "#", "<": "0" },
  "0": { "^": "2", ">": "A", "v": "#", "<": "#" },
  "1": { "^": "4", ">": "2", "v": "#", "<": "#" },
  "2": { "^": "5", ">": "3", "v": "0", "<": "1" },
  "3": { "^": "6", ">": "#", "v": "A", "<": "2" },
  "4": { "^": "7", ">": "5", "v": "1", "<": "#" },
  "5": { "^": "8", ">": "6", "v": "2", "<": "4" },
  "6": { "^": "9", ">": "#", "v": "3", "<": "5" },
  "7": { "^": "#", ">": "8", "v": "4", "<": "#" },
  "8": { "^": "#", ">": "9", "v": "5", "<": "7" },
  "9": { "^": "#", ">": "#", "v": "6", "<": "8" },
};

type Snapshot = [number, Directional, Directional, Numerical, string, string];

const buttons = ["A", "^", "<", "v", ">"] as Directional[];

const getShortestSequenceLengthPart1 = (target: string) => {
  const sequences: Snapshot[] = [[0, "A", "A", "A", "", ""]];

  const visited = new Set<string>();

  while (sequences.length > 0) {
    const [steps, dirRobot1, dirRobot2, numRobot, code, total] = sequences
      .shift()!;

    const hash = `${dirRobot1}${dirRobot2}${numRobot}${code}`;
    if (visited.has(hash)) continue;

    visited.add(hash);

    if (code === target) {
      return total;
    }

    buttons.forEach((next) => {
      if (next !== "A") {
        if (directionalPad[dirRobot1][next] === "#") return;

        sequences.push([
          steps + 1,
          directionalPad[dirRobot1][next] as Directional,
          dirRobot2,
          numRobot,
          code,
          total + next,
        ]);
        return;
      }

      // Propagate to dirRobot2
      if (dirRobot1 !== "A") {
        if (directionalPad[dirRobot2][dirRobot1] === "#") return;

        sequences.push([
          steps + 1,
          dirRobot1,
          directionalPad[dirRobot2][dirRobot1] as Directional,
          numRobot,
          code,
          total + next,
        ]);
        return;
      }

      // Propagate to numRobot
      if (dirRobot2 !== "A") {
        if (numericalPad[numRobot][dirRobot2] === "#") return;

        sequences.push([
          steps + 1,
          dirRobot1,
          dirRobot2,
          numericalPad[numRobot][dirRobot2] as Numerical,
          code,
          total + next,
        ]);
        return;
      }

      // A -> A -> A

      const newCode = code + numRobot;

      if (newCode !== target.slice(0, newCode.length)) return;

      sequences.push([
        steps + 1,
        dirRobot1,
        dirRobot2,
        numRobot,
        newCode,
        total + next,
      ]);
    });
  }
};

const calculatePart1 = () => {
  let complexity = 0;

  targetCodes.forEach((code) => {
    const total = getShortestSequenceLengthPart1(code)!;

    complexity += total.length * parseInt(code.slice(0, -1));
    console.log(code, total);
  });

  return complexity;
};

const calculatePart2 = () => {
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 246990
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
