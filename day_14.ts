const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_14.txt");

const getInitialRobots = (file: string) => {
  return Array.from(
    file
      .matchAll(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g)
      .map(([_, x, y, vx, vy]) => [
        parseInt(x),
        parseInt(y),
        parseInt(vx),
        parseInt(vy),
      ])
  );
};

const xSize = 101;
const xMiddle = Math.floor(xSize / 2);
const ySize = 103;
const yMiddle = Math.floor(ySize / 2);

const getQuadrants = (robots: number[][]) => {
  const quadrants = [0, 0, 0, 0];

  robots.forEach(([x, y, _vx, _vy]) => {
    if (x < xMiddle && y < yMiddle) quadrants[0] += 1;
    else if (x < xMiddle && y > yMiddle) quadrants[1] += 1;
    else if (x > xMiddle && y < yMiddle) quadrants[2] += 1;
    else if (x > xMiddle && y > yMiddle) quadrants[3] += 1;
  });

  return quadrants;
};

const _printMap = (robots: number[][]) => {
  const map = getMap(robots);
  map.forEach((line) => console.log(line));
};

const _saveMap = (filename: string, robots: number[][]) => {
  const map = getMap(robots);
  Deno.writeFileSync(filename, new TextEncoder().encode(map.join("\n")));
};

const getMap = (robots: number[][]) => {
  const robotMap: { [key: string]: number } = {};
  const map: string[] = [];
  robots.forEach(([x, y]) => {
    const label = `${x},${y}`;
    if (robotMap[label] === undefined) robotMap[label] = 1;
    else robotMap[label] += 1;
  });

  for (let y = 0; y < ySize; y++) {
    let line = "";
    for (let x = 0; x < xSize; x++) {
      const label = `${x},${y}`;
      if (robotMap[label] === undefined) line += ".";
      else line += "#";
    }
    map.push(line);
  }
  return map;
};

const moveNSeconds = (robots: number[][], seconds: number) => {
  robots.forEach(([x, y, vx, vy], i, arr) => {
    let xDelta = vx * seconds;
    let yDelta = vy * seconds;

    while (x + xDelta < 0) xDelta += xSize;
    while (y + yDelta < 0) yDelta += ySize;

    arr[i][0] = (x + xDelta) % xSize;
    arr[i][1] = (y + yDelta) % ySize;
  });
};

const calculatePart1 = () => {
  const robots = getInitialRobots(file);
  moveNSeconds(robots, 100);
  const quadrants = getQuadrants(robots);
  return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3];
};

const robotDistance = (robots: number[][]) => {
  let distanceSum = 0;
  let amount = 0;

  const robotSubset = robots.length / 10;

  for (let i = 0; i < robotSubset - 1; i++) {
    const [xi, yi] = robots[i];
    for (let j = i + 1; j < robotSubset; j++) {
      const [xj, yj] = robots[j];
      distanceSum += Math.abs(xj - xi + yj - yi);
      amount++;
    }
  }
  return distanceSum / amount;
};

const calculatePart2 = () => {
  const robots = getInitialRobots(file);
  let seconds = 0;
  const averageDistances: number[] = [];
  while (seconds < 10000) {
    moveNSeconds(robots, 1);

    const averageDistance = robotDistance(robots);
    averageDistances.push(averageDistance);
    seconds++;
  }

  const treeIndex = averageDistances
    .map((x, i) => [i + 1, x])
    .sort((a, b) => a[1] - b[1])[0][0];
  return treeIndex;
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();

const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 225648864
console.log(`Part 2: ${part2}`); // 7847

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
