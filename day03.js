const fs = require('fs');
let sacks = fs.readFileSync('inputs/day03.txt', 'utf8').split('\n');

// Part 1
let priorityTotal = 0;
for (let sack of sacks) {
  const compartment1 = sack.slice(0, sack.length / 2);
  const compartment2 = sack.slice(sack.length / 2);
  const comp1Unique = new Set(compartment1);
  for (let item of compartment2) {
    if (comp1Unique.has(item)) {
      priorityTotal += getPriority(item);
      break;
    }
  }
}
console.log("Answer 1: " + priorityTotal);

// Part 2
priorityTotal = 0;
let trio = [];
for (let i = 0; i < sacks.length; i++) {
  trio.push(sacks[i]);
  if (i % 3 === 2) {
    priorityTotal += getPriority(findBadgeType(trio));
    trio = [];
  }
}
console.log("Answer 2: " + priorityTotal);


function getPriority(char) {
  let asciiVal = char.charCodeAt(0);
  return asciiVal > 96 ? asciiVal - 96 : asciiVal - 38;
}

function findBadgeType(trio) {
  let commonItems = new Set(trio[0]);
  commonItems = new Set(trio[1].split('').filter(item => commonItems.has(item)));
  commonItems = new Set(trio[2].split('').filter(item => commonItems.has(item)));
  return [...commonItems][0];
}