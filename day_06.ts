const file = Deno.readTextFileSync("input/day_06.txt");

const fullMap = file.replaceAll("\n", "");
const size = Math.sqrt(fullMap.length);

const start = fullMap.search(/\^/);
const [x0, y0] = [start % size, Math.trunc(start / size)];

const get = (x: number, y: number) => {
  return fullMap[y * size + x];
};

const nextDir = (dir: string) => {
  if (dir === "up") return "right";
  if (dir === "right") return "down";
  if (dir === "down") return "left";
  return "up";
};

const printMap = (visited: { [location: string]: boolean }) => {
  const visited_indices: number[] = [];
  Object.keys(visited).forEach((location) => {
    const [x, y] = location.split(",").map((x) => parseInt(x));
    visited_indices.push(x + y * size);
  });

  let map = "";
  let x = 0;
  Array.from(fullMap).forEach((location, index) => {
    if (visited_indices.includes(index)) {
      map += "X";
    } else {
      map += location;
    }
    x = (x + 1) % size;
    if (x === 0) {
      map += "\n";
    }
  });

  console.log(map);
};

const findPath = (
  startX: number,
  startY: number,
  direction: string,
  obstacleLocation: number[] = [],
) => {
  const visitedUnique: { [location: string]: boolean } = {};
  const path: string[] = [];

  let currentDir = direction;
  let [x, y] = [startX, startY];

  let placeObstacle = false;
  if (obstacleLocation.length !== 0) {
    placeObstacle = true;
  }

  // Find gard path
  while (x >= 0 && x < size && y >= 0 && y < size) {
    const locationDir = `${x},${y},${currentDir}`;

    if (path.includes(locationDir)) {
      return {
        loop: true,
        path: path,
        visitedUnique: visitedUnique,
      };
    }

    visitedUnique[`${x},${y}`] = true;
    path.push(locationDir);

    let deltaX = 0, deltaY = 0;
    if (currentDir === "up") deltaY = -1;
    else if (currentDir === "right") deltaX = 1;
    else if (currentDir === "down") deltaY = 1;
    else if (currentDir === "left") deltaX = -1;

    if (
      get(x + deltaX, y + deltaY) === "#" ||
      (placeObstacle && x + deltaX === obstacleLocation[0] &&
        y + deltaY === obstacleLocation[1])
    ) {
      currentDir = nextDir(currentDir);
      deltaX = 0;
      deltaY = 0;
    }

    x += deltaX;
    y += deltaY;
  }

  return {
    loop: false,
    path: path,
    visitedUnique: visitedUnique,
  };
};

// printMap(visitedUnique);
const result = findPath(x0, y0, "up");
const uniqueLocations = Object.keys(result.visitedUnique).length;

let numberOfLoops = 0;
const obstacles: { [location: string]: boolean } = {};

let out = false;

result.path.forEach((location, index, arr) => {
  if (index === 0 || out) return;

  const [obstacleX, obstacleY, _] = location.split(",");
  const [x, y, dir] = arr[index - 1].split(",");

  const result = findPath(parseInt(x), parseInt(y), dir, [
    parseInt(obstacleX),
    parseInt(obstacleY),
  ]);
  if (result.loop) {
    numberOfLoops++;
    console.log(
      `(${
        (index * 100 / arr.length).toFixed(1)
      }%) Found ${numberOfLoops} loops: latest obstacle location -> (${obstacleX}, ${obstacleY})`,
    );
    obstacles[`${obstacleX},${obstacleY}`] = true;

    // printMap(result.visitedUnique);
    
    // out = true;
    // console.log(result.path);
    // console.log(result.visitedUnique);
  }
});

console.log(`Part 1: ${uniqueLocations}`); // 5153
console.log(`Part 2: ${Object.keys(obstacles).length}`);
