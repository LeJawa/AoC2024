import { combinations } from "./utils/combinatorics.ts";

const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_23.txt");

const pcs: { [pc: string]: string[] } = {};

let lanPartySize = 0;

file
  .split("\n")
  .map((line) => [line.slice(0, 2), line.slice(3)])
  .forEach(([pca, pcb]) => {
    if (pcs[pca] === undefined) pcs[pca] = [];
    if (pcs[pcb] === undefined) pcs[pcb] = [];

    pcs[pca].push(pcb);
    pcs[pcb].push(pca);

    if (pcs[pca].length > lanPartySize) lanPartySize = pcs[pca].length;
    if (pcs[pcb].length > lanPartySize) lanPartySize = pcs[pcb].length;
  });

const calculatePart1 = () => {
  const connections = new Set<string>();

  for (const pc of Object.keys(pcs)) {
    if (!pc.startsWith("t")) continue;

    const pcCombinations = combinations(pcs[pc], 2);

    for (const [a, b] of pcCombinations) {
      if (pcs[a].includes(b)) {
        connections.add(
          [pc, a, b].toSorted((a, b) => (a < b ? -1 : 1)).join("")
        );
      }
    }
  }
  return connections.size;
};

const calculatePart2 = () => {
  for (const pc of Object.keys(pcs).toSorted((a, b) => (a < b ? -1 : 1))) {
    // if (!pc.startsWith("t")) continue;
    if (pcs[pc].length !== lanPartySize) continue;

    const pcCombinations = combinations(pcs[pc], 2);

    if (pcCombinations.every(([a, b]) => pcs[a].includes(b))) return pcs[pc];
  }
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 1156
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
