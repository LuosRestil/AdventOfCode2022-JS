const fs = require('fs');
let grid = fs.readFileSync('inputs/day08.txt', 'utf8')
  .split('\n')
  .map(row => row.split("").map(digit => parseInt(digit)));

let visibles = (grid.length * 2) + ((grid[0].length - 2) * 2);
for (let row = 1; row < grid.length - 1; row++) {
  for (let col = 1; col < grid[0].length - 1; col++) {
    if (isVisible(row, col, grid)) {
      visibles++;
    }
  }
}
console.log("Answer 1: " + visibles);

// Part 2
let maxScenicScore = 0;
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    const scenicScore = getScenicScore(row, col, grid);
    if (scenicScore > maxScenicScore) {
      maxScenicScore = scenicScore;
    }
  }
}
console.log("Answer 2: " + maxScenicScore);


function isVisible(row, col, grid) {
  if (grid[row].slice(0, col).every(height => height < grid[row][col])) {
    return true;
  }
  if (grid[row].slice(col + 1).every(height => height < grid[row][col])) {
    return true;
  }
  let above = []
  for (let i = 0; i < row; i++) {
    above.push(grid[i][col]);
  }
  if (above.every(height => height < grid[row][col])) {
    return true;
  }
  let below = [];
  for (let i = row + 1; i < grid.length; i++) {
    below.push(grid[i][col]);
  }
  if (below.every(height => height < grid[row][col])) {
    return true;
  }
  return false;
}

function getScenicScore(row, col, grid) {
  let currHeight = grid[row][col];
  let leftScore = 0;
  let i = col - 1;
  while (i >= 0) {
    leftScore++;
    if (grid[row][i] >= currHeight) break;
    i--;
  }
  let rightScore = 0;
  i = col + 1;
  while (i < grid[row].length) {
    rightScore++;
    if (grid[row][i] >= currHeight) break;
    i++;
  }
  let upScore = 0;
  i = row - 1;
  while (i >= 0) {
    upScore++;
    if (grid[i][col] >= currHeight) break;
    i--;
  }
  let downScore = 0;
  i = row + 1;
  while (i < grid.length) {
    downScore++;
    if (grid[i][col] >= currHeight) break;
    i++;
  }
  return leftScore * rightScore * upScore * downScore;
}