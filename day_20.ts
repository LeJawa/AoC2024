const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_20.txt");

const map = Array.from(file.replaceAll("\n", ""));

const size = Math.sqrt(map.length);

const start = map.indexOf("S");
const end = map.indexOf("E");

const distances: { [index: string]: number } = {};

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

    if (map[index] === "#" || visited.has(index)) continue;
    visited.add(index);

    if (index === end) {
      const path = [end];
      distances[end] = 0;
      let node = currentNode;
      let distance = 1;
      while (node.previousNode !== null) {
        node = node.previousNode;
        path.push(node.index);
        distances[node.index] = distance;
        distance++;
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

const printMap = (path: number[] = []) => {
  let line = "";
  map.forEach((v, i) => {
    if (i % size === 0) {
      console.log(line);
      line = "";
    }
    if (path.includes(i)) line += "O";
    else if (v === ".") line += ".";
    else line += "#";
  });
  console.log(line);
};

const path = bfs(end, start);
const limit = 100;

const calculatePart1 = () => {
  const cheatLength = 2;
  let cheats = 0;

  path.forEach((pos) => {
    // up
    if (pos >= cheatLength * size) {
      const newPos = pos - cheatLength * size;
      if (
        distances[newPos] > distances[pos] + cheatLength &&
        distances[newPos] - (distances[pos] + cheatLength) >= limit
      ) {
        cheats++;
      }
    }
    // down
    if (pos < size * (size - cheatLength)) {
      const newPos = pos + cheatLength * size;
      if (
        distances[newPos] > distances[pos] + cheatLength &&
        distances[newPos] - (distances[pos] + cheatLength) >= limit
      ) {
        cheats++;
      }
    }
    // left
    if (pos % size > 1) {
      const newPos = pos - cheatLength;
      if (
        distances[newPos] > distances[pos] + cheatLength &&
        distances[newPos] - (distances[pos] + cheatLength) >= limit
      ) {
        cheats++;
      }
    }
    // rigth
    if (pos % size < size - cheatLength) {
      const newPos = pos + cheatLength;
      if (
        distances[newPos] > distances[pos] + cheatLength &&
        distances[newPos] - (distances[pos] + cheatLength) >= limit
      ) {
        cheats++;
      }
    }
  });

  return cheats;
};

const manhattanDistance = (index1: number, index2: number) => {
  const x1 = index1 % size;
  const y1 = Math.trunc(index1 / size);
  const x2 = index2 % size;
  const y2 = Math.trunc(index2 / size);

  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
};

const getNumberOfCheats = (cheatLength: number) => {
  let cheats = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    for (let j = i + 1; j < path.length; j++) {
      const to = path[j];

      const manDistance = manhattanDistance(from, to);
      if (
        distances[to] - distances[from] - Math.min(manDistance, cheatLength) <
          limit
      ) continue;

      if (manDistance > cheatLength) continue;
      // console.log(`From (${from% size}, ${Math.trunc(from/ size)}) to (${to% size}, ${Math.trunc(to/ size)}): ${distances[to] - distances[from]}`);

      cheats++;
    }
  }

  return cheats;
};

const calculatePart2 = () => {
  return getNumberOfCheats(20);
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 1286
console.log(`Part 2: ${part2}`); // 989316

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
