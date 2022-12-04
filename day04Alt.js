const fs = require('fs');
let input = fs.readFileSync('inputs/day04.txt', 'utf8').split('\n');

// Part 1 & 2
let fullOverlaps = 0;
let allOverlaps = 0;
for (let line of input) {
  const elfPair = line.split(',');
  const elf1 = elfPair[0].split('-').map(int => parseInt(int));
  const elf2 = elfPair[1].split('-').map(int => parseInt(int));
  let outer;
  if (elf1[0] === elf2[0]) {
    if (elf1[1] <= elf2[1]) {
      outer = elf2;
    } else {
      outer = elf1;
    }
  } else if (elf1[0] < elf2[0]) {
    outer = elf1;
  } else {
    outer = elf2;
  }
  const other = outer === elf1 ? elf2 : elf1;
  if (other[0] <= outer[1]) {
    allOverlaps++;
    if (other[1] <= outer[1]) {
      fullOverlaps++;
    }
  }
}
console.log("Answer 1: " + fullOverlaps);
console.log("Answer 2: " + allOverlaps);