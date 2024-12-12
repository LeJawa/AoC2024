import { TupleSet } from "./utils/tupleset.ts";

const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_12.txt");

const map = file.split("\n");
const size = map.length;

const getAreaPerimeter = (
  x0: number,
  y0: number,
  map: string[],
  visited: TupleSet,
) => {
  const queue: number[][] = [[x0, y0]];
  let perimeter = 0;
  let area = 0;

  while (queue.length > 0) {
    const cell: number[] = queue.pop()!;

    if (visited.has(cell)) continue;

    visited.add(cell);
    area += 1;

    const [x, y] = cell;

    if (x > 0) {
      if (map[y][x - 1] === map[y][x]) {
        queue.push([x - 1, y]);
      } else {
        perimeter += 1;
      }
    } else {
      perimeter += 1;
    }
    if (x < size - 1) {
      if (map[y][x + 1] === map[y][x]) {
        queue.push([x + 1, y]);
      } else {
        perimeter += 1;
      }
    } else {
      perimeter += 1;
    }
    if (y > 0) {
      if (map[y - 1][x] === map[y][x]) {
        queue.push([x, y - 1]);
      } else {
        perimeter += 1;
      }
    } else {
      perimeter += 1;
    }
    if (y < size - 1) {
      if (map[y + 1][x] === map[y][x]) {
        queue.push([x, y + 1]);
      } else {
        perimeter += 1;
      }
    } else {
      perimeter += 1;
    }
  }

  return [area, perimeter];
};

const calculatePart1 = () => {
  const visited = new TupleSet();
  let price = 0;

  map.forEach((row, y) => {
    Array.from(row).forEach((_, x) => {
      if (visited.has([x, y])) return;

      const [area, perimeter] = getAreaPerimeter(x, y, map, visited);
      price += area * perimeter;
    });
  });
  return price;
};

const calculatePart2 = () => {
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 1549354
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
