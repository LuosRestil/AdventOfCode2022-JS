const fs = require('fs');

// Part 1
let pairs = fs.readFileSync('inputs/day13.txt', 'utf8')
  .split('\n\n')
  .map(pair => pair.split('\n')
  .map(arr => JSON.parse(arr)));

let orderedPairs = [];
for (let i = 0; i < pairs.length; i++) {
  let order = inOrder(pairs[i][0], pairs[i][1]);
  if (order < 0) {
    orderedPairs.push(i + 1);
  }
}
console.log("Answer 1: " + orderedPairs.reduce((acc, curr) => acc + curr));

// Part 2
let lines = fs.readFileSync('inputs/day13.txt', 'utf8')
  .split('\n')
  .filter(line => line !== "")
  .map(line => JSON.parse(line));
lines.push([[2]]);
lines.push([[6]]);

lines.sort((a, b) => inOrder(a, b));

let decoderKey = 1;
for (let i = 0; i < lines.length; i++) {
  const lineString = JSON.stringify(lines[i]);
  if (lineString === '[[2]]') decoderKey *= (i + 1);
  else if (lineString === '[[6]]') {
    decoderKey *= (i + 1);
    break;
  }
}
console.log("Answer 2: " + decoderKey);


function inOrder(elem1, elem2) {
  if (typeof elem1 === 'number' && typeof elem2 === 'object') {
    elem1 = [elem1];
  } else if (typeof elem1 === 'object' && typeof elem2 === 'number') {
    elem2 = [elem2];
  }
  if (typeof elem1 === 'number') {
    return elem1 - elem2;
  } else {
    let i = 0;
    while (true) {
      if (elem1[i] === undefined && elem2[i] === undefined) return 0;
      else if (elem1[i] === undefined) return -1;
      else if (elem2[i] === undefined) return 1;
      let result = inOrder(elem1[i], elem2[i]);
      if (result === 0) {
        i++;
      } else {
        return result;
      }
    }
  }
}