import { permutationsWithReplacement } from "./utils/combinatorics.ts";

const file = Deno.readTextFileSync("input/day_07.txt");

const operationCheck = (
    numbers: number[],
    operators: string[],
    target: number,
) => {
    let total = numbers[0];
    operators.forEach((op, i) => {
        if (total > target) return;
        if (op === "+") {
            total += numbers[i + 1];
        } else if (op === "*") {
            total *= numbers[i + 1];
        } else if (op === "||") {
            total = parseInt(`${total}${numbers[i + 1]}`);
        }
    });
    return total;
};

const checkPermutations = (
    numbers: number[],
    
    permutations: Generator<string[], any, any>,
    target: number,
) => {
    let permutationFound = false;
    permutations.forEach((perm) => {
        if (permutationFound) return;
        const total = operationCheck(numbers, perm, target);
        if (total === target) {
            permutationFound = true;
        }
    });
    return permutationFound;
};

let part1CalibrationResult = 0;
let part2CalibrationResult = 0;

file.split("\n").forEach((line) => {
    const [totalString, arg] = line.split(":");
    const targetTotal = parseInt(totalString);
    const numbers = arg.trim().split(" ").map((x) => parseInt(x));

    const operatorNumber = numbers.length - 1;

    const smallOperatorPool = ["+", "*"];
    const bigOperatorPool = ["+", "*", "||"];

    const part1Permutations = permutationsWithReplacement(
        smallOperatorPool,
        operatorNumber,
    );
    const part2Permutations = permutationsWithReplacement(
        bigOperatorPool,
        operatorNumber,
    );

    if (checkPermutations(numbers, part1Permutations, targetTotal)) {
        part1CalibrationResult += targetTotal;
        part2CalibrationResult += targetTotal;
    }
    else if (checkPermutations(numbers, part2Permutations, targetTotal)) {
        part2CalibrationResult += targetTotal;
    }
});

console.log(`Part 1: ${part1CalibrationResult}`); // 10741443549536
console.log(`Part 2: ${part2CalibrationResult}`); // 500335179214836
