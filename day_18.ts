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

const printMap = (path: number[] = []) => {
  let line = "";
  map.forEach((v, i) => {
    if (i % size === 0) {
      console.log(line);
      line = "";
    }
    if (path.includes(i)) line += "O";
    else if (v) line += ".";
    else line += "#";
  });
  console.log(line);
};

interface Node {
  index: number;
  previousNode: Node;
}

const bfs = (start: number, end: number) => {
  const queue: Node[] = [];
  queue.push({ index: start, previousNode: null! });

  const visited = new Set<number>();

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    const { index } = currentNode;

    if (!map[index] || visited.has(index)) continue;
    visited.add(index);

    if (index === end) {
      const path = [end];
      let node = currentNode;
      while (node.previousNode !== null) {
        node = node.previousNode;
        path.push(node.index);
      }

      return path;
    }

    // up
    if (index >= size) {
      queue.push({
        index: index - size,
        previousNode: currentNode,
      });
    }
    // down
    if (index < size * (size - 1)) {
      queue.push({
        index: index + size,
        previousNode: currentNode,
      });
    }
    // left
    if (index % size != 0) {
      queue.push({
        index: index - 1,
        previousNode: currentNode,
      });
    }
    // rigth
    if (index % size != size - 1) {
      queue.push({
        index: index + 1,
        previousNode: currentNode,
      });
    }
  }

  return [];
};

const calculatePart1 = () => {
  fillMapWithBytes(0, 1024);
  // printMap();
  const path = bfs(start, end)!;
  return path.length - 1;
};

const calculatePart2 = () => {
  let byteIndex = 1024;

  let path = bfs(start, end)!;
  while (path.length !== 0) {
    // printMap(path);
    fillMapWithBytes(++byteIndex, 1);
    if (!path.includes(bytes[byteIndex])) continue;
    path = bfs(start, end)!;
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
