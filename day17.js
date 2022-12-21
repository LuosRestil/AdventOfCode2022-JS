const fs = require('fs');

const jetPattern = fs.readFileSync('inputs/day17.txt', 'utf8').split('').map(char => char === '<' ? -1 : 1);
const blocks = [
  {locs: [[0, 0], [0, 1], [0, 2], [0, 3]], height: 1},
  {locs: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], height: 3},
  {locs: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], height: 3},
  {locs: [[0, 0], [1, 0], [2, 0], [3, 0]], height: 4},
  {locs: [[0, 0], [0, 1], [1, 0], [1, 1]], height: 2}
];
let numRocks = 2022;
const boardWidth = 7;
let highPoint = 0;
let floor = -1;

let occupied = {};
for (let i = 0; i < boardWidth; i++) {
  occupied[i] = new Set();
}

// drop pieces
let [blocksCounter, jetsCounter] = [0, 0];
let [blocksLen, jetsLen] = [blocks.length, jetPattern.length];
let blockSettled = true;
let block, loc, move, jet, floorSearch;
while (blocksCounter < numRocks) {
  jet = jetPattern[jetsCounter % jetsLen];
  if (blockSettled) {
    // spawn new block
    block = blocks[blocksCounter % blocksLen];
    loc = [highPoint + 3, 2];
    move = 'blow';
    blockSettled = false;
    floorSearch = true;
  }
  if (move === 'blow') {
    // move to the side
    if (canBeBlown(block, loc, jet)) {
      loc[1] += jet;
    } 
    jetsCounter++;
    move = 'fall';
  } else {
    // fall
    if (canFall(block, loc)) {
      loc[0]--;
    } else {
      settlePiece(block, loc);
      blockSettled = true;
      highPoint = Math.max(loc[0] + block.height, highPoint);
      blocksCounter++;
    }
    move = 'blow';
  }

}

console.log('Answer 1: ' + highPoint);

function canBeBlown(block, loc, jet) {
  return block.locs.every(square => {
    let proposedCol = loc[1] + square[1] + jet;
    return proposedCol > -1 && proposedCol < boardWidth && !occupied[proposedCol].has(loc[0] + square[0]);
  })
}

function canFall(block, loc) {
  return block.locs.every(square => {
    let proposedRow = loc[0] + square[0] - 1;
    return proposedRow > floor && !occupied[loc[1] + square[1]].has(proposedRow);
  })
}

function settlePiece(block, loc) {
  block.locs.forEach(square => {
    occupied[loc[1] + square[1]].add(loc[0] + square[0]);
  })
}