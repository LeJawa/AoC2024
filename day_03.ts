const file = Deno.readTextFileSync("input/day_03.txt");

let full_multiplication_sum = 0;
let conditional_multiplication_sum = 0;

let enable_mult = true;

file.match(/(mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/g)?.forEach((match) => {
  if (match === "do()") enable_mult = true;
  else if (match === "don't()") enable_mult = false;
  else {
    const [a, b] = match.match(/\d+/g)!;
    const mul = parseInt(a) * parseInt(b);
    full_multiplication_sum += mul;
    if (enable_mult) conditional_multiplication_sum += mul;
  }
});

console.log(`Part 1: ${full_multiplication_sum}`);
console.log(`Part 2: ${conditional_multiplication_sum}`);
