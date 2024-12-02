const file = Deno.readTextFileSync("input/day_02.txt");

let part1SafeReports = 0;
let part2SafeReports = 0;

const isSafe = (report: number[], part2 = false): boolean => {
  const increasing = report[1] - report[0] > 0;
  let safe = true;
  let breakLoop = false;
  let indexToRemove: number = undefined!;
  report.forEach((n, i, array) => {
    if (breakLoop) return;

    if (i === array.length - 1) return;

    if (increasing) {
      if (!(array[i + 1] > n && array[i + 1] < n + 4)) {
        safe = false;

        if (part2) {
          indexToRemove = i + 1;
          breakLoop = true;
          return;
        }
      }
    } else if (!(array[i + 1] < n && array[i + 1] > n - 4)) {
      safe = false;

      if (part2) {
        indexToRemove = i + 1;
        breakLoop = true;
        return;
      }
    }
  });

  if (!safe && part2) {
    const newReport = report
      .slice(0, indexToRemove)
      .concat(report.slice(indexToRemove + 1));
    safe = isSafe(newReport);

    if (!safe && (indexToRemove == 1 || indexToRemove == 2)) {
      safe = isSafe(report.slice(1));
      if (!safe) {
        safe = isSafe(report.slice(0, 1).concat(report.slice(2)));
      }
    }
  }
  return safe;
};

file.split("\n").forEach((line) => {
  const report = line.match(/\d+/g)!.map((n) => parseInt(n));

  const part1Safe = isSafe(report);
  if (part1Safe) {
    part1SafeReports += 1;
    part2SafeReports += 1;
  } else if (isSafe(report, true)) {
    part2SafeReports += 1;
  }
});

console.log(`Part 1: ${part1SafeReports}`); // 321
console.log(`Part 2: ${part2SafeReports}`); // 386
