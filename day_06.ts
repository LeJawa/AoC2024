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

const getMap = (visited: Set<string>, obstacle: number[] = [-1, -1]) => {
  const visited_indices: number[] = [];
  visited.forEach((location) => {
    const [x, y] = location.split(",").map((x) => parseInt(x));
    visited_indices.push(x + y * size);
  });
  const obstacleIndex = obstacle[0] + obstacle[1] * size;

  let map = "";
  let x = 0;
  Array.from(fullMap).forEach((location, index) => {
    if (visited_indices.includes(index)) {
      map += "X";
    } else if (index === obstacleIndex) {
      map += "O";
    } else {
      map += location;
    }
    x = (x + 1) % size;
    if (x === 0) {
      map += "\n";
    }
  });

  return map;
};

const _saveMap = (
  filename: string,
  visited: Set<string>,
  obstacle: number[],
) => {
  Deno.writeFileSync(
    filename,
    new TextEncoder().encode(getMap(visited, obstacle)),
  );
};

const _printMap = (visited: Set<string>) => {
  console.log(getMap(visited));
};

const findPath = (
  startX: number,
  startY: number,
  direction: string,
  obstacleLocation: number[] = [],
) => {
  const visitedUnique: Set<string> = new Set();
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

    visitedUnique.add(`${x},${y}`);
    path.push(locationDir);

    let deltaX = 0, deltaY = 0;
    if (currentDir === "up") deltaY = -1;
    else if (currentDir === "right") deltaX = 1;
    else if (currentDir === "down") deltaY = 1;
    else if (currentDir === "left") deltaX = -1;

    if (
      ((x + deltaX) < size && get(x + deltaX, y + deltaY) === "#") ||
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
const uniqueLocations = result.visitedUnique.size;

const findObstacles = (path: string[]) => {
  // let numberOfLoops = 0;
  const obstacles: Set<string> = new Set();
  const visited: Set<string> = new Set();

  path.forEach((location, index, arr) => {
    const [obstacleX, obstacleY, _] = location.split(",");
    const obstacleString = `${obstacleX},${obstacleY}`;

    if (
      visited.has(obstacleString) ||
      (parseInt(obstacleX) == x0 && parseInt(obstacleY) == y0)
    ) {
      return;
    }
    visited.add(obstacleString);

    const [x, y, dir] = arr[index - 1].split(",");

    const result = findPath(parseInt(x), parseInt(y), dir, [
      parseInt(obstacleX),
      parseInt(obstacleY),
    ]);
    if (result.loop) {
      // numberOfLoops++;
      // console.log(
      //   `(${
      //     (index * 100 / arr.length).toFixed(1)
      //   }%) Found ${numberOfLoops} loops: latest obstacle location -> (${obstacleX}, ${obstacleY})`,
      // );
      obstacles.add(obstacleString);
      // saveMap(`./out/${numberOfLoops}.txt`, result.visitedUnique, [
      //   parseInt(obstacleX),
      //   parseInt(obstacleY),
      // ]);
      // console.log(result.path);
      // console.log(result.visitedUnique);
    }
  });

  return obstacles;
};

const obstacles = findObstacles(result.path);

// _printMap(result.visitedUnique);

console.log(`Part 1: ${uniqueLocations}`); // 5153
console.log(`Part 2: ${obstacles.size}`); // 1711 (quite long)
