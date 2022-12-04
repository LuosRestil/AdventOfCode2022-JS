const fs = require('fs');
let input = fs.readFileSync('inputs/day04.txt', 'utf8').split('\n');

// Part 1
let fullOverlaps = 0;
for (let line of input) {
  const elfPair = line.split(',');
  const elf1 = elfPair[0].split('-').map(int => parseInt(int));
  const elf2 = elfPair[1].split('-').map(int => parseInt(int));
  if ((elf1[0] >= elf2[0] && elf1[1] <= elf2[1]) || (elf2[0] >= elf1[0] && elf2[1] <= elf1[1])) {
    fullOverlaps++;
  }
}
console.log(fullOverlaps);

// Part 2
let totalOverlaps = 0;
for (let line of input) {
  const elfPair = line.split(',');
  const elf1 = elfPair[0].split('-').map(int => parseInt(int));
  const elf2 = elfPair[1].split('-').map(int => parseInt(int));
  const smallerStartElf = elf1[0] <= elf2[0] ? elf1 : elf2;
  const greaterStartElf = smallerStartElf === elf1 ? elf2 : elf1;
  if (greaterStartElf[0] <= smallerStartElf[1]) {
    totalOverlaps++;
  }
}
console.log(totalOverlaps);