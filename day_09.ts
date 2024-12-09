const file = Deno.readTextFileSync("input/day_09.txt");

let actualFile = file;
if (actualFile.length % 2 === 0) {
  actualFile = file.slice(0, -1);
}

const calculatePart1Checksum = (file: string) => {
  let forwardIndex = 0;
  let backwardIndex = file.length - 1;
  
  let spaceToAllocate = parseInt(file[backwardIndex]);
  
  // let fileIndex = 0
  
  let checksum = 0;
  let memoryIndex = 0;
  
  const fileIndex = (index: number) => Math.trunc(index / 2);
  
  while (forwardIndex < backwardIndex) {
    // Do file
    const fileSize = parseInt(file[forwardIndex]);
  
    for (let i = 0; i < fileSize; i++, memoryIndex++) {
      checksum += memoryIndex * fileIndex(forwardIndex);
    }
  
    forwardIndex++;
  
    // Do empty space
    let emptySpace = parseInt(file[forwardIndex]);
  
    while (emptySpace > 0) {
      if (spaceToAllocate > 0) {
        spaceToAllocate--;
      } else {
        backwardIndex -= 2;
        spaceToAllocate = parseInt(file[backwardIndex]) - 1;
      }
  
      checksum += memoryIndex * fileIndex(backwardIndex);
      memoryIndex++;
      emptySpace--;
    }
  
    forwardIndex++;
  }
  
  if (forwardIndex === backwardIndex) {
    while (spaceToAllocate > 0) {
      checksum += memoryIndex * fileIndex(backwardIndex);
      memoryIndex++;
      spaceToAllocate--;
    }
  }

  return checksum
}

const calculatePart2Checksum = (file: string) => {
  
}

const part1Checksum = calculatePart1Checksum(actualFile)
const part2Checksum = calculatePart2Checksum(actualFile)


console.log(`Part 1: ${part1Checksum}`); // 6346871685398
console.log(`Part 2: ${part2Checksum}`); // 
