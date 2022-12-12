const fs = require('fs');
let letterGrid = fs.readFileSync('inputs/day12.txt', 'utf8').split('\n').map(line => line.split(''));

class Cell {  
  constructor(row, col, grid) {
    this.row = row;
    this.col = col;
    let letter = grid[row][col];
    if (letter === 'S') letter = 'a';
    if (letter === 'E') letter = 'z';
    this.elevation = letter.charCodeAt(0);
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.cameFrom = null;
  }
  
  // get references to cell neighbors for easier calculations later
  addNeighbors(grid) {
    let potentialNeighbor;
    if (this.row < grid.length - 1) {
      potentialNeighbor = grid[this.row + 1][this.col];
      if (potentialNeighbor.elevation - this.elevation < 2) {
        this.neighbors.push(potentialNeighbor);
      }
    }
    if (this.row > 0) {
      potentialNeighbor = grid[this.row - 1][this.col];
      if (potentialNeighbor.elevation - this.elevation < 2) {
        this.neighbors.push(potentialNeighbor);
      }
    }
    if (this.col < grid[0].length - 1) {
      potentialNeighbor = grid[this.row][this.col + 1];
      if (potentialNeighbor.elevation - this.elevation < 2) {
        this.neighbors.push(potentialNeighbor);
      }
    }
    if (this.col > 0) {
      potentialNeighbor = grid[this.row][this.col - 1]
      if (potentialNeighbor.elevation - this.elevation < 2) {
        this.neighbors.push(potentialNeighbor);
      }
    }
  }
}

// Part 1
console.log("Answer 1: " + findDistanceToSummit(letterGrid));

// Part 2
let aLocs = [];
for (let i = 0; i < letterGrid.length; i++) {
  for (let j = 0; j < letterGrid[0].length; j++) {
    if (letterGrid[i][j] === 'a') {
      aLocs.push([i, j]);
    }
  }
}

let minimumDistanceToSummit = Infinity;
for (let aLoc of aLocs) {
  const distanceToSummit = findDistanceToSummit(letterGrid, aLoc);
  if (distanceToSummit && distanceToSummit < minimumDistanceToSummit) {
    minimumDistanceToSummit = distanceToSummit;
  }
}
console.log("Answer 2: " + minimumDistanceToSummit);


function findDistanceToSummit(letterGrid, startPos = null) {
  let grid = letterGrid.map(row => {
    return row.slice();
  });
  let openSet = [];
  let closedSet = [];
  let start;
  let end;
  let current;

  // populate grid with cells
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = new Cell(i, j, letterGrid);
    }
  }

  if (startPos) {
    start = grid[startPos[0]][startPos[1]];
  }

  // establish start and end points
  for (let i = 0; i < letterGrid.length; i++) {
    for (let j = 0; j < letterGrid[0].length; j++) {
      if (letterGrid[i][j] === 'S' && !start) {
        start = grid[i][j];
      } else if (letterGrid[i][j] === 'E') {
        end = grid[i][j];
      }
      if (start && end) {
        break;
      }
    }
  }

  // find each cell's neighbors and calculate its heuristic
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j].addNeighbors(grid);
      grid[i][j].h = heuristic(grid[i][j], end);
    }
  }
  openSet.push(start);

  while (true) {
    if (openSet.length > 0) {
      let winner = 0;

      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }

      current = openSet[winner];
      closedSet.push(current);
      openSet.splice(winner, 1);
      let neighbors = current.neighbors;

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        if (!closedSet.includes(neighbor)) {
          let tentativeG = 1 + current.g;
          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tentativeG < neighbor.g) {
              neighbor.g = tentativeG;
              newPath = true;
            }
          } else {
            neighbor.g = tentativeG;
            openSet.push(neighbor);
            newPath = true;
          }
          
          // calculate new f score
          neighbor.f = neighbor.g + neighbor.h;
          if (newPath) {
            // update reference to which node was the previous cell in the path to this cell if we have updated its g
            neighbor.cameFrom = current;
          }
        }
      }
      if (current === end) {
        return calculatePathCost(current);
      }
    } else {
      return null;
    }
  }
}

function heuristic(a, b) { // euclidean distance
  return Math.sqrt(Math.pow(b.row - a.row, 2) + Math.pow(b.col - a.col, 2));
}

function calculatePathCost(current) {
  let cost = 0;
  let p = current;
  while (p.cameFrom) {
    p = p.cameFrom;
    cost += 1;
  }
  return cost;
}