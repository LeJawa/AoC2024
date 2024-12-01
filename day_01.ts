const file = Deno.readTextFileSync("input/day_01.txt")

const list1: number[] = []
const list2: number[] = []

file.split("\n").forEach(line => {
  const [a, b] = line.split("   ")
  list1.push(parseInt(a))
  list2.push(parseInt(b))
})

const sorted1 = list1.sort((a,b) => a - b)
const sorted2 = list2.sort((a,b) => a - b)

let distance = 0

for(let i = 0; i<list1.length; i++) {
  distance += Math.abs(sorted1[i] - sorted2[i])
}

let similarity = 0

sorted1.forEach(n => {
  const first = sorted2.findIndex((value) => value == n)
  if (first != -1) {
    const last = sorted2.findLastIndex((value) => value == n)

    similarity += n * (last - first + 1)
  }
})


console.log(`Part 1: ${distance}`)
console.log(`Part 2: ${similarity}`)

