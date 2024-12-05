import { permutations } from "./utils/combinatorics.ts";

const file = Deno.readTextFileSync("input/day_05.txt");

const pageAfterRules: { [x: string]: number[] } = {};
const pageBeforeRules: { [x: string]: number[] } = {};
const updates: number[][] = [];

let parsingRules = true;
file.split("\n").forEach((line) => {
  if (line === "") {
    parsingRules = false;
    return;
  }

  if (parsingRules) {
    const [x, y] = line.match(/\d+/g)!.map((n) => parseInt(n));

    if (pageAfterRules[x] === undefined) {
      pageAfterRules[x] = [];
    }
    if (pageBeforeRules[y] === undefined) {
      pageBeforeRules[y] = [];
    }

    pageAfterRules[x].push(y);
    pageBeforeRules[y].push(x);
  } else {
    const update = line.split(",").map((n) => parseInt(n));
    updates.push(update);
  }
});

Object.keys(pageAfterRules).forEach((k) => {
  pageAfterRules[k].sort((a, b) => a - b);
});
Object.keys(pageBeforeRules).forEach((k) => {
  pageBeforeRules[k].sort((a, b) => a - b);
});

let correctMiddlePageSum = 0;
let wrongMiddlePageSum = 0;

// Returns value of middle page if correct, else 0
function checkUpdate(update: number[]): number {
  let updateError = false;

  update.forEach((p, i, arr) => {
    if (updateError) return;

    const pagesBefore = arr.slice(0, i);
    const pagesAfter = arr.slice(i + 1);

    pagesBefore.forEach((pb) => {
      if (pageAfterRules[p]?.includes(pb)) {
        updateError = true;
        return;
      }
    });
    pagesAfter.forEach((pa) => {
      if (pageBeforeRules[p]?.includes(pa)) {
        updateError = true;
        return;
      }
    });
  });

  if (updateError) return 0;

  return update[Math.floor(update.length / 2)];
}

// Fixes update and returns value of middle page
function fixUpdate(update: number[]): number {
  let updateError = true;

  while (updateError) {
    updateError = false;
    update.forEach((p, i, arr) => {
      if (updateError) return;

      const pagesBefore = arr.slice(0, i);
      const pagesAfter = arr.slice(i + 1);

      pagesBefore.forEach((pb, j) => {
        if (updateError) return;
        if (pageAfterRules[p]?.includes(pb)) {
          updateError = true;

          arr[i] = pb;
          arr[j] = p;
          return;
        }
      });
      pagesAfter.forEach((pa, k) => {
        if (updateError) return;
        if (pageBeforeRules[p]?.includes(pa)) {
          updateError = true;
          arr[i] = pa;
          arr[i + k + 1] = p;
          return;
        }
      });
    });
  }

  const middlePage = update[Math.floor(update.length / 2)];

  // console.log(`Found middle page: ${middlePage} for update: ${update}`);

  return middlePage;
}

updates.forEach((update) => {
  const middlePage = checkUpdate(update);
  correctMiddlePageSum += middlePage;
  if (middlePage === 0) {
    wrongMiddlePageSum += fixUpdate(update);
  }
});

console.log(`Part 1: ${correctMiddlePageSum}`); // 4957
console.log(`Part 2: ${wrongMiddlePageSum}`); // 6938
