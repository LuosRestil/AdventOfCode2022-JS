const fs = require('fs');
const SAND_SOURCE_INDEX = 500;

let input = fs.readFileSync('inputs/day14.txt', 'utf8')
  .split('\n')
  .map(line => line.split(' -> ').map(coord => coord.split(',').map(num => parseInt(num))));

// find necessary dimensions of cave map
let [minCol, maxCol, maxRow] = [Infinity, 0, 0];
for (let line of input) {
  for (let coord of line) {
    if (coord[0] < minCol) minCol = coord[0];
    if (coord[0] > maxCol) maxCol = coord[0];
    if (coord[1] > maxRow) maxRow = coord[1];
  }
}
maxRow += 2;
const pyramidWidth = (maxRow * 2) - 1;
minCol = Math.min(minCol, SAND_SOURCE_INDEX - (Math.floor(pyramidWidth / 2))) - 1;
maxCol = Math.max(maxCol, SAND_SOURCE_INDEX + (Math.floor(pyramidWidth / 2))) + 1;
// use an offset to avoid a huge, mostly-empty map
const colOffset = minCol;

// create cave map
const caveMap = Array(maxRow + 1).fill(null).map(() => Array(maxCol - minCol + 1).fill(0));
for (let line of input) {
  line[0][0] -= colOffset;
  for (let i = 1; i < line.length; i++) {
    line[i][0] -= colOffset;
    if (line[i][0] === line[i - 1][0]) {
      let max = Math.max(line[i][1], line[i-1][1]);
      let min = Math.min(line[i][1], line[i-1][1]);
      for (let j = min; j <= max; j++) {
        caveMap[j][line[i][0]] = 1;
      }
    } else {
      let max = Math.max(line[i][0], line[i-1][0]);
      let min = Math.min(line[i][0], line[i-1][0]);
      for (let j = min; j <= max; j++) {
        caveMap[line[i][1]][j] = 1;
      }
    }
  }
}
// make floor
for (let i = 0; i < caveMap[0].length; i++) {
  caveMap[caveMap.length - 1][i] = 1;
}

const sandSource = SAND_SOURCE_INDEX - colOffset;

console.log('Answer 1: ' + dropSand(caveMap.map(row => row.slice()), sandSource, 1));
console.log('Answer 2: ' + dropSand(caveMap.map(row => row.slice()), sandSource, 2));


function dropSand(grid, sandSource, part) {
  let sandUnits = 0;
  while (true) {
    let sandRow = 0;
    let sandCol = sandSource;
    let sandResting = false;
    while (!sandResting) {
      // part 1 return condition
      if (part === 1) {
        if (sandRow === grid.length - 2) { // sand has fallen below pt. 1 low point
          return sandUnits;
        }
      } else {
        // part 2 return condition
        if (grid[0][sandSource]) { // sand has blocked entrance
          return sandUnits;
        }
      }
      if (!grid[sandRow + 1][sandCol]) {
        sandRow++;
      } else if (!grid[sandRow + 1][sandCol - 1]) {
        sandRow++;
        sandCol--;
      } else if (!grid[sandRow + 1][sandCol + 1]) {
        sandRow++;
        sandCol++;
      } else {
        grid[sandRow][sandCol] = 1;
        sandResting = true;
        sandUnits++;
      }
    }
  }
}