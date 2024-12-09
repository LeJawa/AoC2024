import { permutations } from "./utils/combinatorics.ts";


const t0 = performance.now();

const file = Deno.readTextFileSync("input/day_08.txt");

const fullMap = file.replaceAll("\n", "");
const size = Math.sqrt(fullMap.length);

const getCoord = (index: number) => {
    return [index % size, Math.trunc(index / size)];
};

const findAntinodes = (a: number[], b: number[], part: number = 1) => {
    const deltaX = b[0] - a[0];
    const deltaY = b[1] - a[1];

    const maxX = Math.abs(Math.trunc(size / deltaX));
    const maxY = Math.abs(Math.trunc(size / deltaY));

    const minmax = Math.min(maxX, maxY);

    const antinodes: number[][] = [];

    if (part === 2) {
        for (let i = 0; i < minmax; i++) {
            antinodes.push([a[0] - deltaX * i, a[1] - deltaY * i]);
            antinodes.push([b[0] + deltaX * i, b[1] + deltaY * i]);
        }
    } else {
        antinodes.push([a[0] - deltaX, a[1] - deltaY]);
        antinodes.push([b[0] + deltaX, b[1] + deltaY]);
    }

    return antinodes;
};

const printMap = (antinodes: Set<string>) => {
    const antinodes_indices: number[] = [];
    antinodes.forEach((location) => {
        const [x, y] = location.split(",").map((x) => parseInt(x));
        antinodes_indices.push(x + y * size);
    });

    let map = "";
    let x = 0;
    Array.from(fullMap).forEach((location, index) => {
        if (antinodes_indices.includes(index)) {
            map += "#";
        } else {
            map += location;
        }
        x = (x + 1) % size;
        if (x === 0) {
            map += "\n";
        }
    });

    console.log(map);
};

const antennas: { [key: string]: number[][] } = {};

Array.from(fullMap).forEach((c, i) => {
    if (c === ".") return;
    if (antennas[c] === undefined) antennas[c] = [];
    antennas[c].push(getCoord(i));
});

// console.log(antennas);

const getAntinodes = (part: number) => {
    const uniqueAntinodes = new Set<string>();

    Object.keys(antennas).forEach((frequency) => {
        const perms = permutations(antennas[frequency], 2);
        perms.forEach((pair) => {
            const antinodes = findAntinodes(pair[0], pair[1], part);
            antinodes.forEach(([x, y]) => {
                if (x < 0 || x >= size || y < 0 || y >= size) return;
                uniqueAntinodes.add(`${x},${y}`);
            });
        });
    });

    return uniqueAntinodes;
};

const t1 = performance.now();
const antinodesPart1 = getAntinodes(1);
const t2 = performance.now();
const antinodesPart2 = getAntinodes(2);
const t3 = performance.now();

// printMap(uniqueAntinodes)

console.log(`Part 1: ${antinodesPart1.size}`); // 273
console.log(`Part 2: ${antinodesPart2.size}`); // 1017

console.log(`Start up took ${(t1 - t0).toFixed(3)} milliseconds.`);
console.log(`Part 1 took ${(t2 - t1).toFixed(3)} milliseconds.`);
console.log(`Part 2 took ${(t3 - t2).toFixed(3)} milliseconds.`);
console.log(`Total took ${(t3 - t0).toFixed(3)} milliseconds.`);
