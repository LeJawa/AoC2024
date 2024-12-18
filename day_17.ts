const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_17.txt");

const [_, rawa, rawb, rawc, rawInst] = file.match(
  /^Register A: (\d+)\WRegister B: (\d+)\WRegister C: (\d+)\W+Program: ([\d,]+)$/,
)!;
const inst = rawInst.split(",").map((x) => parseInt(x));

let a = BigInt(parseInt(rawa));
let b = BigInt(parseInt(rawb));
let c = BigInt(parseInt(rawc));

const combo = (x: number) => {
  if (x < 4) return BigInt(x);
  if (x == 4) return a;
  if (x == 5) return b;
  if (x == 6) return c;
  throw new Error("Combo is 7");
};

let terminal: number[] = [];

const adv = (x: number) => {
  a = a / (2n ** combo(x));
  return 2;
};
const bdv = (x: number) => {
  b = a / (2n ** combo(x));
  return 2;
};
const cdv = (x: number) => {
  c = a / (2n ** combo(x));
  return 2;
};
const bxl = (x: number) => {
  b = b ^ BigInt(x);
  return 2;
};
const bst = (x: number) => {
  b = combo(x) % 8n;
  return 2;
};
const jnz = (x: number) => {
  if (a === 0n) return 2;
  return Number(x);
};
const bxc = (_x: number) => {
  b = b ^ c;
  return 2;
};
const out = (x: number) => {
  terminal.push(Number(combo(x) % 8n));
  return 2;
};

const instFunctions = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

const doInst = (index: number) => {
  const opcode = Number(inst[index]);

  if (opcode === 3) {
    if (a === 0n) return index + 2;
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

const bruteForcePart2 = () => {
  const final: string[] = [];
  terminal = [];
  let output = terminal.join(",");
  let aStart = 16777216n;
  let loop =0
  while (output !== rawInst && loop++ < 100 ) {
    a = ++aStart;
    b = 0n;
    c = 0n;
    terminal = [];
    let index = 0;
    while (index >= 0 && index < inst.length - 1) {
      index = doInst(index);
      // if (!terminal.every((x, i) => x !== 7 || i % 2 === 0)) continue;
    }
    // if (terminal.length === inst.length) {
    output = terminal.join(",");
    //   console.log(output);
    // }
    final.push(aStart + ":  " + output);
  }

  Deno.writeFileSync(
    "out/test17.txt",
    new TextEncoder().encode(final.join("\n")),
  );
  return aStart;
};

const calculatePart2 = () => {
  let result = 0;

  inst.forEach((v, i) => {
    result += v * 8 ** (i+1);
  });

  bruteForcePart2()

  return result;
};

const t1 = performance.now();
// const part1 = calculatePart1();
const part1 = 0
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); //
console.log(`Part 2: ${part2}`); // 130647579931408 is too low

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
