import { TupleSet } from "./utils/tupleset.ts";

const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_12.txt");

const map = file.split("\n");
const size = map.length;

const calculateSides = (outside: Set<string>) => {
  let sides = 0;
  const sideSet = new Set();

  const mappedOutside = Array.from(outside).map((v) => {
    const [x, y, dir] = v.split(",");
    return [parseInt(x), parseInt(y), dir];
  });

  mappedOutside.forEach(([x, y, dir]) => {
    if (sideSet.has(`${x},${y},${dir}`)) {
      return;
    }
    sideSet.add(`${x},${y},${dir}`);
    sides += 1;

    if (dir === "left" || dir === "right") {
      // go down
      let delta = 1;
      while (true) {
        if (outside.has(`${x},${y as number + delta},${dir}`)) {
          sideSet.add(`${x},${y as number + delta},${dir}`);
          delta += 1;
        } else {
          break;
        }
      }
      // go up
      delta = -1;
      while (true) {
        if (outside.has(`${x},${y as number + delta},${dir}`)) {
          sideSet.add(`${x},${y as number + delta},${dir}`);
          delta += -1;
        } else {
          break;
        }
      }
    } else if (dir === "up" || dir === "down") {
      // go right
      let delta = 1;
      while (true) {
        if (outside.has(`${x as number + delta},${y},${dir}`)) {
          sideSet.add(`${x as number + delta},${y},${dir}`);
          delta += 1;
        } else {
          break;
        }
      }
      // go left
      delta = -1;
      while (true) {
        if (outside.has(`${x as number + delta},${y},${dir}`)) {
          sideSet.add(`${x as number + delta},${y},${dir}`);
          delta += -1;
        } else {
          break;
        }
      }
    }
  });

  return sides;
};

const getAreaPerimeter = (
  x0: number,
  y0: number,
  map: string[],
  visited: TupleSet,
) => {
  const queue: number[][] = [[x0, y0]];
  const outside = new Set<string>();
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
        outside.add(`${x - 1},${y},right`);
      }
    } else {
      outside.add(`${x - 1},${y},right`);
    }
    if (x < size - 1) {
      if (map[y][x + 1] === map[y][x]) {
        queue.push([x + 1, y]);
      } else {
        outside.add(`${x + 1},${y},left`);
      }
    } else {
      outside.add(`${x + 1},${y},left`);
    }
    if (y > 0) {
      if (map[y - 1][x] === map[y][x]) {
        queue.push([x, y - 1]);
      } else {
        outside.add(`${x},${y - 1},up`);
      }
    } else {
      outside.add(`${x},${y - 1},up`);
    }
    if (y < size - 1) {
      if (map[y + 1][x] === map[y][x]) {
        queue.push([x, y + 1]);
      } else {
        outside.add(`${x},${y + 1},down`);
      }
    } else {
      outside.add(`${x},${y + 1},down`);
    }
  }
  const perimeter = outside.size;
  const sides = calculateSides(outside);

  return [area, perimeter, sides];
};

const calculatePart1 = () => {
  const visited = new TupleSet();
  let price = 0;

  map.forEach((row, y) => {
    Array.from(row).forEach((_, x) => {
      if (visited.has([x, y])) return;

      const [area, perimeter, _sides] = getAreaPerimeter(x, y, map, visited);
      price += area * perimeter;
    });
  });
  return price;
};

const calculatePart2 = () => {
  const visited = new TupleSet();
  let price = 0;

  map.forEach((row, y) => {
    Array.from(row).forEach((_, x) => {
      if (visited.has([x, y])) return;

      const [area, _perimeter, sides] = getAreaPerimeter(x, y, map, visited);
      price += area * sides;
    });
  });
  return price;
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 1549354
console.log(`Part 2: ${part2}`); // 937032

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
