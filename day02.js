const fs = require('fs');
let input = fs.readFileSync('inputs/day02.txt', 'utf8').split('\n');

// Part 1
let score = 0;
const beats = {'C': 'B', 'B': 'A', 'A': 'C'};
for (let line of input) {
  const opponentMove = line[0];
  const myMove = String.fromCharCode(line.charCodeAt(2) - 23); // 23 is the difference between 'X' and 'A'
  score += calculateMatchScore1(myMove, opponentMove, beats);
}
console.log('Answer 1: ' + score);

// Part 2
score = 0;
const requiredMoves = {
  'A': {'X': 'C', 'Y': 'A', 'Z': 'B'},
  'B': {'X': 'A', 'Y': 'B', 'Z': 'C'},
  'C': {'X': 'B', 'Y': 'C', 'Z': 'A'}
}
for (let line of input) {
  const opponentMove = line[0];
  const requiredResult = line[2];
  score += calculateMatchScore2(opponentMove, requiredResult, requiredMoves);
}
console.log('Answer 2: ' + score);


function calculateMatchScore1(myMove, opponentMove, beats) {
  const moveScore = myMove.charCodeAt(0) - 64; // 64 is ascii value of 'A'
  let resultScore = 0 + (myMove === opponentMove ? 3 : beats[myMove] === opponentMove ? 6 : 0);
  return moveScore + resultScore;
}

function calculateMatchScore2(opponentMove, requiredResult, requiredMoves) {
  const resultScore = (requiredResult.charCodeAt(0) - 88) * 3; // 88 is ascii value of 'X'
  const requiredMove = requiredMoves[opponentMove][requiredResult];
  const moveScore = requiredMove.charCodeAt(0) - 64;
  return resultScore + moveScore;
}