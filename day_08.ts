import { permutations } from "./utils/combinatorics.ts";

const file = Deno.readTextFileSync("input/day_08.txt");

const fullMap = file.replaceAll("\n", "");
const size = Math.sqrt(fullMap.length);

const get = (x: number, y: number) => {
    return fullMap[y * size + x];
};

const getCoord = (index: number) => {
    return [index % size, Math.trunc(index / size)];
};

const findAntinodes = (a: number[], b: number[]) => {
    const deltaX = b[0] - a[0];
    const deltaY = b[1] - a[1];

    const maxX = Math.abs(Math.trunc(size / deltaX))
    const maxY = Math.abs(Math.trunc(size / deltaY))

    const minmax = Math.min(maxX, maxY)

    const antinodes: number[][] = []

    for (let i = 0; i < minmax; i++) {
        antinodes.push([a[0] - deltaX*i, a[1] - deltaY*i])
        antinodes.push([b[0] + deltaX*i, b[1] + deltaY*i])
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

const uniqueAntinodes = new Set<string>();

Object.keys(antennas).forEach((frequency) => {
    const perms = permutations(antennas[frequency], 2);
    perms.forEach((pair) => {
        const antinodes = findAntinodes(pair[0], pair[1]);
        antinodes.forEach(([x, y]) => {
            if (x < 0 || x >= size || y < 0 || y >= size) return;
            uniqueAntinodes.add(`${x},${y}`);
        });
    });
});
printMap(uniqueAntinodes)
console.log(`Part 1: ${uniqueAntinodes.size}`);
