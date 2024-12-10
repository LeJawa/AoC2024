const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_10.txt");

const map = file.split("\n");

const trailSearch = (x0: number, y0: number) => {
  const queue = [];
  queue.push([x0, y0]);

  const trails: string[] = [];

  while (queue.length > 0) {
    const [x, y] = queue.pop()!;

    const height = parseInt(map[y][x]);

    if (height === 9) {
      trails.push(`${x},${y}`);
      continue;
    }

    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].forEach(([i, j]) => {
      if (
        x + i < 0 ||
        x + i > map[y].length - 1 ||
        y + j < 0 ||
        y + j > map.length - 1
      )
        return;

      if (parseInt(map[y + j][x + i]) == height + 1) {
        queue.push([x + i, y + j]);
      }
    });
  }

  return trails;
};

const t1 = performance.now();

let part1TrailSum = 0;
let part2TrailSum = 0;

map.forEach((row, y) => {
  Array.from(row).forEach((c, x) => {
    if (c === "0") {
      const trails = trailSearch(x, y);
      part1TrailSum += new Set(trails).size;
      part2TrailSum += trails.length;
    }
  });
});

const part1 = part1TrailSum;
const t2 = performance.now();
const part2 = part2TrailSum;
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 841
console.log(`Part 2: ${part2}`); // 1875

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
