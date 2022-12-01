const fs = require('fs');
let input = fs.readFileSync('inputs/day01.txt', 'utf8').split('\n');

// Part 1
let elfCals = [];
let currentElf = 0;
for (let line of input) {
  if (line === "") {
    elfCals.push(currentElf);
    currentElf = 0;
  } else {
    currentElf += parseInt(line);
  }
}

elfCals.sort((a, b) => b - a);

let ans = elfCals[0];
console.log("Answer 1: " + ans);

// Part 2

ans = elfCals.slice(0, 3).reduce((acc, curr) => acc + curr);
console.log("Answer 2: " + ans);