const t0 = performance.now();
const file = Deno.readTextFileSync("input/day_17.txt");

const [_, rawa, rawb, rawc, rawInst] = file.match(
  /^Register A\: (\d+)\WRegister B\: (\d+)\WRegister C\: (\d+)\W+Program\: ([\d,]+)$/,
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
  // Not actually used, implemented in doInst
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

const runAllInst = (aStart: number = Number(a)) => {
  a = BigInt(aStart);
  b = 0n;
  c = 0n;
  let index = 0;
  terminal = [];
  while (index >= 0 && index < inst.length - 1) {
    index = doInst(index);
  }

  return terminal;
};

const calculatePart1 = () => {
  return runAllInst().join(",");
};

const _bruteForcePart2 = () => {
  const final: string[] = [];
  terminal = [];
  let output = terminal.join(",");
  let aStart = 1;
  let loop = 0;
  while (output !== rawInst && loop++ < 10000) {
    a = BigInt(aStart);
    b = 0n;
    c = 0n;
    terminal = [];
    let index = 0;
    while (index >= 0 && index < inst.length - 1) {
      index = doInst(index);
      // if (
      //   terminal.length > 0 &&
      //   terminal[terminal.length - 1] !== inst[terminal.length - 1]
      // ) break;
    }
    // if (terminal.length >= inst.length - 3) {
    output = terminal.join(",");
    // console.log(output);
    // }
    final.push(`${aStart} (${aStart.toString(2)}): ${output}`);
    aStart += 1;
  }

  Deno.writeFileSync(
    "out/test17.txt",
    new TextEncoder().encode(final.join("\n")),
  );
  return aStart;
};

const getPossibilities = (seed: bigint, target: number) => {
  const base = seed * 8n;

  const possibilities: bigint[] = [];

  for (let k = 0; k < 8; k++) {
    const test = base + BigInt(k);

    a = base + BigInt(k);
    b = 0n;
    c = 0n;
    let index = 0;
    terminal = [];
    while (index < inst.length - 3) {
      index = doInst(index);
    }

    if (terminal[0] === target) {
      possibilities.push(test);
    }
  }

  return possibilities;
};

type Test = [bigint, number];

const calculatePart2 = () => {
  const toCheck: Test[] = [[0n, 0]];

  const answers = [];

  while (toCheck.length > 0) {
    const [current, index] = toCheck.pop()!;

    if (index === inst.length) {
      answers.push(Number(current));
    }

    const possibilities = getPossibilities(
      current,
      inst[inst.length - 1 - index],
    );

    const next = possibilities.map((n) => [n, index + 1]) as Test[];
    toCheck.push(...next);
  }

  return Math.min(...answers);
};

const t1 = performance.now();
const part1 = calculatePart1();
const t2 = performance.now();
const part2 = calculatePart2();
const t3 = performance.now();

console.log(`Part 1: ${part1}`); // 1,7,6,5,1,0,5,0,7
console.log(`Part 2: ${part2}`); // 236555995274861

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
