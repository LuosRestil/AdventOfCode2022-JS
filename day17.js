const fs = require('fs');

const jetPattern = fs.readFileSync('inputs/day17.txt', 'utf8').split('').map(char => char === '<' ? -1 : 1);
const blocks = [
  {locs: [[0, 0], [0, 1], [0, 2], [0, 3]], height: 1},
  {locs: [[0, 1], [-1, 0], [-1, 1], [-1, 2], [-2, 1]], height: 3},
  {locs: [[0, 0], [0, 1], [0, 2], [-1, 2], [-2, 2]], height: 3},
  {locs: [[0, 0], [-1, 0], [-2, 0], [-3, 0]], height: 4},
  {locs: [[0, 0], [0, 1], [-1, 0], [-1, 1]], height: 2}
];
const cumulativeBlockHeight = blocks.reduce((height, block) => height + block.height, 0);
let numRocks = 2022;
let boardHeight = Math.ceil((numRocks / blocks.length) * cumulativeBlockHeight);
let boardWidth = 7;
let board = new Array(boardHeight).fill(null).map(() => new Array(boardWidth).fill(0));
let highPoint = board.length - 1;

// drop pieces
let [blocksCounter, jetsCounter] = [0, 0];
let [blocksLen, jetsLen] = [blocks.length, jetPattern.length];
let blockSettled = true;
let block, loc, move, jet;
while (blocksCounter < numRocks) {
  jet = jetPattern[jetsCounter % jetsLen];
  if (blockSettled) {
    // spawn new block
    block = blocks[blocksCounter % blocksLen];
    loc = [highPoint - 3, 2];
    move = 'blow';
    blockSettled = false;
  }

  // drawPiece(block, loc);
  // drawBoard();
  // clearPiece();

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
      loc[0]++;
    } else {
      settlePiece(block, loc);
      // drawBoard();
      blockSettled = true;
      highPoint = Math.min(loc[0] - block.height, highPoint);
      blocksCounter++;

    }
    move = 'blow';
  }
}
console.log('Answer 1: ' + (boardHeight - highPoint - 1));

function canBeBlown(block, loc, jet) {
  return block.locs.every(square => {
    let proposedCol = loc[1] + square[1] + jet;
    return proposedCol > -1 && proposedCol < boardWidth && board[loc[0] + square[0]][proposedCol] === 0;
  })
}

function canFall(block, loc) {
  return block.locs.every(square => {
    let proposedRow = loc[0] + square[0] + 1;
    return proposedRow < boardHeight && board[proposedRow][loc[1] + square[1]] !== 1;
  })
}

function settlePiece(block, loc) {
  block.locs.forEach(square => {
    board[loc[0] + square[0]][loc[1] + square[1]] = 1;
  })
}

function drawPiece(block, loc) {
  block.locs.forEach(square => {
    board[loc[0] + square[0]][loc[1] + square[1]] = 2;
  })
}

function clearPiece() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === 2) {
        board[i][j] = 0;
      }
    }
  }
}

function drawBoard() {
  for (let line of board) {
    console.log(JSON.stringify(line));
  }
  console.log();
  console.log("*******************");
  console.log();
}