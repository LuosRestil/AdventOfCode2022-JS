const fs = require('fs');
let input = fs.readFileSync('inputs/day02.txt', 'utf8').split('\n');

// Part 1
let score = 0;
for (let line of input) {
  const opponentMove = line[0];
  const myMove = String.fromCharCode(line.charCodeAt(2) - 23); // 23 is the difference between 'X' and 'A'
  score += calculateMatchScore1(myMove, opponentMove);
}
console.log('Answer 1: ' + score);

// Part 2
score = 0;
for (let line of input) {
  const opponentMove = line[0];
  const requiredResult = line[2];
  score += calculateMatchScore2(opponentMove, requiredResult);
}
console.log('Answer 2: ' + score);


function calculateMatchScore1(myMove, opponentMove) {
  const moveScore = myMove.charCodeAt(0) - 64; // 64 is ascii value of 'A'
  let resultScore = 0;
  const gap = Math.abs(myMove.charCodeAt(0) - opponentMove.charCodeAt(0));
  if (gap === 0) {
    resultScore += 3;
  } else if (gap === 1) {
    resultScore += myMove > opponentMove ? 6 : 0;
  } else if (gap === 2) {
    resultScore += opponentMove > myMove ? 6 : 0;
  }
  return moveScore + resultScore;
}

function calculateMatchScore2(opponentMove, requiredResult) {
  const resultScore = (requiredResult.charCodeAt(0) - 88) * 3; // 88 is ascii value of 'X'
  const opponentMoveNumeric = opponentMove.charCodeAt(0) - 65; // 65 is ascii value of 'A'
  const requiredMoveOffset = requiredResult.charCodeAt(0) - 88 - 1; // 88 is ascii value of 'X'
  let requiredMoveValue = opponentMoveNumeric + requiredMoveOffset + 1;
  if (requiredMoveValue === 0) requiredMoveValue = 3;
  else if (requiredMoveValue === 4) requiredMoveValue = 1;
  return resultScore + requiredMoveValue;
}