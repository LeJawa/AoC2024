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
    .map((line) => Array.from(line))
);

const secondMap = Array.from(
  file
    .split("\n")
    .filter((line) => line[0] === "#")
    .map((line) =>
      Array.from(Array.from(line).map(secondWarehouseConverter).join(""))
    )
);

const instructions = Array.from(
  file
    .split("\n")
    .filter((line) => line[0] !== "#" && line.length !== 0)
    .join("")
);

const getStartingPosition = (map: string[][]) => {
  const startingPosition: number[] = [];
  map.some((row, y) =>
    row.some((cell, x, row) => {
      if (cell === "@") {
        startingPosition.push(x);
        startingPosition.push(y);
        //   row[x] = ".";
        return true;
      }
      return false;
    })
  );
  return startingPosition;
};

const printMap = (map: string[][]) => {
  map.forEach((row) => {
    console.log(row.join(""));
  });
};

type Direction = ">" | "<" | "v" | "^";

const checkNextPosPart1 = (
  [x, y]: number[],
  dir: number[],
  map: string[][]
) => {
  if (map[y + dir[1]][x + dir[0]] === "#") return false;

  if (
    map[y + dir[1]][x + dir[0]] === "." ||
    checkNextPosPart1([x + dir[0], y + dir[1]], dir, map)
  ) {
    map[y + dir[1]][x + dir[0]] = map[y][x];
    map[y][x] = ".";
    return true;
  }
};

const checkNextPosPart2 = (
  [x, y]: number[],
  dir: number[],
  map: string[][]
) => {
  if (map[y + dir[1]][x + dir[0]] === "#") return false;
};

const moveRobotPart1 = (
  [xr, yr]: number[],
  instruction: Direction,
  map: string[][]
) => {
  let dir: number[];
  if (instruction === ">") dir = [1, 0];
  else if (instruction === "<") dir = [-1, 0];
  else if (instruction === "^") dir = [0, -1];
  else dir = [0, 1];

  if (checkNextPosPart1([xr, yr], dir, map)) {
    return [xr + dir[0], yr + dir[1]];
  } else {
    return [xr, yr];
  }
};

const moveRobotPart2 = (
  [xr, yr]: number[],
  instruction: Direction,
  map: string[][]
) => {
  let dir: number[];
  if (instruction === ">") dir = [1, 0];
  else if (instruction === "<") dir = [-1, 0];
  else if (instruction === "^") dir = [0, -1];
  else dir = [0, 1];

  if (checkNextPosPart2([xr, yr], dir, map)) {
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
  //   printMap(map);
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
  printMap(secondMap);
  let robotPosition = getStartingPosition(secondMap);
  instructions.forEach((inst) => {
    // console.log(inst);
    robotPosition = moveRobotPart2(robotPosition, inst as Direction, secondMap);
    // printMap(secondMap);
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
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
