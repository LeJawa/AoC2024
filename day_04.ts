const file = Deno.readTextFileSync("input/day_04.txt");

const input = file.replace(/\n/g, "");

const size = Math.sqrt(input.length); // 140

function findWordCount(word: string) {
  let count = 0;

  Array.from(input).forEach((_, i, arr) => {
    if (arr[i] !== word[0]) return;

    const x = i % size;
    const y = Math.trunc(i / size);

    // console.log(x, y);

    if (x < size - 3) {
      if (
        arr[i + 1] === word[1] && arr[i + 2] === word[2] &&
        arr[i + 3] === word[3]
      ) {
        count++;
      }
      if (y < size - 3) {
        if (
          arr[i + size + 1] === word[1] &&
          arr[i + 2 * size + 2] === word[2] &&
          arr[i + 3 * size + 3] === word[3]
        ) {
          count++;
        }
      }
    }
    if (y < size - 3) {
      if (
        arr[i + size] === word[1] && arr[i + 2 * size] === word[2] &&
        arr[i + 3 * size] === word[3]
      ) {
        count++;
      }
      if (x > 2) {
        if (
          arr[i + size - 1] === word[1] &&
          arr[i + 2 * size - 2] === word[2] &&
          arr[i + 3 * size - 3] === word[3]
        ) {
          count++;
        }
      }
    }
  });

  return count;
}

function findCrossMas() {
  let count = 0;

  Array.from(input).forEach((_, i, arr) => {
    if (arr[i] !== "A") return;

    const x = i % size;
    const y = Math.trunc(i / size);

    if (x == 0 || x == size - 1 || y == 0 || y == size - 1) return;

    if (
      (arr[i - size - 1] === "M" && arr[i + size + 1] == "S") ||
      (arr[i - size - 1] === "S" && arr[i + size + 1] == "M")
    ) {
      if (
        (arr[i - size + 1] === "M" && arr[i + size - 1] == "S") ||
        (arr[i - size + 1] === "S" && arr[i + size - 1] == "M")
      ) {
        count++;
      }
    }
  });

  return count;
}

const xmasCount = findWordCount("XMAS") + findWordCount("SAMX");
const crossMasCount = findCrossMas();

console.log(`Part 1: ${xmasCount}`); // 2521
console.log(`Part 2: ${crossMasCount}`); // 1912
