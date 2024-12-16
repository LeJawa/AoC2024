const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_15.txt");

const secondWarehouseConverter = (char: string) => {
  if (char === ".") return "..";
  if (char === "#") return "##";
  if (char === "O") return "[]";
  if (char === "@") return "@.";
  return "";
};

const map = Array.from(
  file
    .split("\n")
    .filter((line) => line[0] === "#")
    .map((line) => Array.from(line)),
);

const secondMap = Array.from(
  file
    .split("\n")
    .filter((line) => line[0] === "#")
    .map((line) =>
      Array.from(Array.from(line).map(secondWarehouseConverter).join(""))
    ),
);

const instructions = Array.from(
  file
    .split("\n")
    .filter((line) => line[0] !== "#" && line.length !== 0)
    .join(""),
);

const getStartingPosition = (map: string[][]) => {
  const startingPosition: number[] = [];
  map.some((row, y) =>
    row.some((cell, x) => {
      if (cell === "@") {
        startingPosition.push(x);
        startingPosition.push(y);
        return true;
      }
      return false;
    })
  );
  return startingPosition;
};

const _printMap = (map: string[][]) => {
  map.forEach((row) => {
    console.log(row.join(""));
  });
};

type Direction = ">" | "<" | "v" | "^";

const checkNextPosPart1 = (
  [x, y]: number[],
  dir: number[],
  map: string[][],
) => {
  if (map[y + dir[1]][x + dir[0]] === "#") return false;

  if (
    map[y + dir[1]][x + dir[0]] === "." ||
    checkNextPosPart1([x + dir[0], y + dir[1]], dir, map)
  ) {
    return true;
  }
  return false;
};

const checkNextPosPart2 = (
  [x, y]: number[],
  dir: number[],
  map: string[][],
): boolean => {
  const nextCell = map[y + dir[1]][x + dir[0]];
  if (nextCell === "#") return false;
  const checkNext = checkNextPosPart2([x + dir[0], y + dir[1]], dir, map);
  if (
    nextCell === "." ||
    (dir[1] === 0 && checkNext)
  ) return true;
  if (nextCell === "[") {
    return checkNext &&
      checkNextPosPart2([x + 1, y + dir[1]], dir, map);
  }
  if (nextCell === "]") {
    return checkNext &&
      checkNextPosPart2([x - 1, y + dir[1]], dir, map);
  }
  return false;
};

const moveRobotPart1 = (
  [xr, yr]: number[],
  instruction: Direction,
  map: string[][],
) => {
  let dir: number[];
  if (instruction === ">") dir = [1, 0];
  else if (instruction === "<") dir = [-1, 0];
  else if (instruction === "^") dir = [0, -1];
  else dir = [0, 1];

  if (checkNextPosPart1([xr, yr], dir, map)) {
    propagateMovement([xr, yr], dir, map);
    return [xr + dir[0], yr + dir[1]];
  } else {
    return [xr, yr];
  }
};

const propagateMovement = (
  [x, y]: number[],
  dir: number[],
  map: string[][],
) => {
  if (dir[1] === 0) horizontalMovement([x, y], dir, map);
  else verticalMovement([x, y], dir, map);
};

const horizontalMovement = (
  [x, y]: number[],
  dir: number[],
  map: string[][],
) => {
  if (map[y + dir[1]][x + dir[0]] !== ".") {
    horizontalMovement([x + dir[0], y + dir[1]], dir, map);
  }

  map[y + dir[1]][x + dir[0]] = map[y][x];
  map[y][x] = ".";
};

const verticalMovement = (
  [x, y]: number[],
  dir: number[],
  map: string[][],
) => {
  const nextCell = map[y + dir[1]][x + dir[0]];
  if (nextCell !== ".") {
    verticalMovement([x + dir[0], y + dir[1]], dir, map);
    if (nextCell === "[") {
      verticalMovement([x + dir[0] + 1, y + dir[1]], dir, map);
    } else if (nextCell === "]") {
      verticalMovement([x + dir[0] - 1, y + dir[1]], dir, map);
    }
  }

  map[y + dir[1]][x + dir[0]] = map[y][x];
  map[y][x] = ".";
};

const moveRobotPart2 = (
  [xr, yr]: number[],
  instruction: Direction,
  map: string[][],
) => {
  let dir: number[];
  if (instruction === ">") dir = [1, 0];
  else if (instruction === "<") dir = [-1, 0];
  else if (instruction === "^") dir = [0, -1];
  else dir = [0, 1];

  if (checkNextPosPart2([xr, yr], dir, map)) {
    propagateMovement([xr, yr], dir, map);
    return [xr + dir[0], yr + dir[1]];
  } else {
    return [xr, yr];
  }
};

const getGPSSum = (map: string[][]) => {
  let gpsSum = 0;

  map.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell === "O" || cell === "[") {
        gpsSum += y * 100 + x;
      }
    })
  );
  return gpsSum;
};

const calculatePart1 = () => {
  // printMap(map);
  let robotPosition = getStartingPosition(map);
  instructions.forEach((inst) => {
    // console.log(inst);
    robotPosition = moveRobotPart1(robotPosition, inst as Direction, map);
    // printMap(map);
  });

  const gpsSum = getGPSSum(map);
  return gpsSum;
};

const calculatePart2 = () => {
  // printMap(secondMap);
  let robotPosition = getStartingPosition(secondMap);
  let step = 1;
  instructions.forEach((inst) => {
    // console.log(step, inst);
    robotPosition = moveRobotPart2(robotPosition, inst as Direction, secondMap);
    // printMap(secondMap);
    step++;
  });
  const gpsSum = getGPSSum(secondMap);
  return gpsSum;
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 1492518
console.log(`Part 2: ${part2}`); // 1512860

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
