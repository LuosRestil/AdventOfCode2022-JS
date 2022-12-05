const fs = require('fs');
let input = fs.readFileSync('inputs/day05.txt', 'utf8').split('\n');

// setup
let crateLines = [];
let instructions = [];
let numStacks;
let pushTo = crateLines;
for (let line of input) {
  if (line[1] === '1') {
    numStacks = parseInt(line[line.length - 2]);
    pushTo = instructions;
    continue;
  }
  pushTo.push(line);
}

for (let i = 1; i <= 2; i++) {
  // create crate stacks as arrays
  let crates = new Array(numStacks).fill(null).map(_ => new Array());
  for (let i = crateLines.length - 1; i >= 0; i--) {
    const line = crateLines[i];
    for (let j = 0; j < line.length; j++) {
      if (j % 4 === 1 && line[j] !== ' ') {
        crates[Math.floor(j / 4)].push(line[j]);
      }
    }
  }

  // follow instructions
  for (let instruction of instructions) {
    const nums = instruction.match(/[0-9]+/g)
    const numCrates = parseInt(nums[0]);
    const source = crates[parseInt(nums[1]) - 1];
    const destination = crates[parseInt(nums[2]) - 1];
    if (i === 1) {
      // Part 1
      for (let i = 0; i < numCrates; i++) {
        destination.push(source.pop() || '');
      }
    } else {
      // Part 2
      for (let i = numCrates; i > 0; i--) {
        destination.push(source[source.length - i]);
      }
      source.splice(source.length - numCrates);
    }
  }
  let answer = crates.map(crate => crate.pop() || '').join('');
  console.log(`Answer ${i}: ` + answer);
}

