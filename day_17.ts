const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_17.txt");

const [_, rawa, rawb, rawc, rawInst] = file.match(
  /^Register A: (\d+)\WRegister B: (\d+)\WRegister C: (\d+)\W+Program: ([\d,]+)$/,
)!;
const inst = rawInst.split(",").map((x) => parseInt(x));

let a = parseInt(rawa);
let b = parseInt(rawb);
let c = parseInt(rawc);

const combo = (x: number) => {
  if (x < 4) return x;
  if (x == 4) return a;
  if (x == 5) return b;
  if (x == 6) return c;
  return -1;
};

let terminal: number[] = [];

const adv = (x: number) => {
  a = Math.trunc(a / (2 ** combo(x)));
  return 2;
};
const bdv = (x: number) => {
  b = Math.trunc(a / (2 ** combo(x)));
  return 2;
};
const cdv = (x: number) => {
  c = Math.trunc(a / (2 ** combo(x)));
  return 2;
};
const bxl = (x: number) => {
  b = b ^ x;
  return 2;
};
const bst = (x: number) => {
  b = combo(x) % 8;
  return 2;
};
const jnz = (x: number) => {
  if (a === 0) return 2;
  return x;
};
const bxc = (_x: number) => {
  b = b ^ c;
  return 2;
};
const out = (x: number) => {
  terminal.push(combo(x) % 8);
  return 2;
};

const instFunctions = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

const doInst = (index: number) => {
  const opcode = inst[index];

  if (opcode === 3) {
    if (a === 0) return index + 2;
    return inst[index + 1];
  }

  return index + instFunctions[opcode](inst[index + 1]);
};

const calculatePart1 = () => {
  let index = 0;
  terminal = [];
  while (index >= 0 && index < inst.length - 1) {
    index = doInst(index);
  }

  return terminal.join(",");
};

const calculatePart2 = () => {
  terminal = [];
  let output = terminal.join(",");
  let aStart = 50118712000000;

  while (output !== rawInst) {
    a = ++aStart;
    b = 0;
    c = 0;
    terminal = [];
    let index = 0;
    while (index >= 0 && index < inst.length - 1) {
      index = doInst(index);
      if (terminal.some((x) => x < 0)) break;
      if (!terminal.every((x, i) => x !== 7 || i % 2 === 1)) break;
    }
    if (terminal.length === inst.length) {
      output = terminal.join(",");
      // console.log(output);
    }
  }

  return aStart;
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); //
console.log(`Part 2: ${part2}`); //

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
