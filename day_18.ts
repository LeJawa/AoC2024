const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_18.txt");

const size = 71;
const map = new Array<boolean>(size * size).fill(true);

const start = 0;
const end = size * size - 1;

const bytes = file.split("\n").map((line) => {
  const [x, y] = line.split(",");
  return parseInt(x) + size * parseInt(y);
});

const fillMapWithBytes = (start: number, n: number) => {
  for (let i = 0; i < n; i++) {
    map[bytes[start + i]] = false;
  }
};

const _printMap = () => {
  let line = "";
  map.forEach((v, i) => {
    if (i % size === 0) {
      console.log(line);
      line = "";
    }
    if (v) line += ".";
    else line += "#";
  });
  console.log(line);
};

const bfsPart1 = (start: number, end: number) => {
  const queue: number[][] = [];
  queue.push([start, 0]);

  const visited = new Set<number>();

  while (queue.length > 0) {
    const [index, steps] = queue.shift()!;

    if (!map[index] || visited.has(index)) continue;
    visited.add(index);

    if (index === end) {
      return steps;
    }

    // up
    if (index >= size) queue.push([index - size, steps + 1]);
    // down
    if (index < size * (size - 1)) queue.push([index + size, steps + 1]);
    // left
    if (index % size != 0) queue.push([index - 1, steps + 1]);
    // rigth
    if (index % size != size - 1) queue.push([index + 1, steps + 1]);
  }
};

const calculatePart1 = () => {
  fillMapWithBytes(0, 1024);
  // printMap();
  const steps = bfsPart1(start, end);
  return steps;
};

const calculatePart2 = () => {
  let byteIndex = 1024;
  let steps: number | undefined = 0;
  while (steps !== undefined) {
    fillMapWithBytes(++byteIndex, 1);
    steps = bfsPart1(start, end);
  }

  return `${bytes[byteIndex] % size},${Math.trunc(bytes[byteIndex] / size)}`;
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 324
console.log(`Part 2: ${part2}`); // 46,23

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
