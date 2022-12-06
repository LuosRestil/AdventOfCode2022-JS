const fs = require('fs');
let buffer = fs.readFileSync('inputs/day06.txt', 'utf8');

function findMarker(buffer, markerSize) {
  for (let i = markerSize; i < buffer.length; i++) {
    let window = buffer.slice(i - markerSize, i);
    let uniques = new Set(window);
    if (window.length === uniques.size) {
      console.log("Answer: " + i);
      break;
    }
  }
}

findMarker(buffer, 4);
findMarker(buffer, 14);