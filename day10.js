const fs = require('fs');
let input = fs.readFileSync('inputs/day10.txt', 'utf8').split('\n');

// Part 1
let x = 1;
let cycle = 1;
let significant = 0;

for (let line of input) {
  line = line.split(" ");
  significant += checkCycle(cycle) ? cycle * x : 0;
  cycle++;
  if (line[0] === 'addx') {
    const amt = parseInt(line[1]);
    significant += checkCycle(cycle) ? cycle * x : 0;
    x += amt;
    cycle++;
  }
}

console.log("Answer 1: " + significant);

// Part 2
let screen = [];
x = 1;
let cursor = 0;
let row = [];

for (let line of input) {
  row.push(isInSprite(cursor, x) ? '#' : '.');
  moveCursor();
  line = line.split(" ");
  if (line[0] === 'addx') {
    row.push(isInSprite(cursor, x) ? '#' : '.');
    moveCursor();
    const amt = parseInt(line[1]);
    x += amt;
  }
}
for (let row of screen) {
  console.log(row);
}
// view console output for answer 2


function checkCycle(cycle) {
  return (cycle - 20) % 40 === 0;
}

function isInSprite(cursor, x) {
  return [x - 1, x, x + 1].includes(cursor);
}

function moveCursor() {
  cursor = (cursor + 1) % 40;
  if (cursor === 0) {
    screen.push(row.join(''));
    row = []
  }
}