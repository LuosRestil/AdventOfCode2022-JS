const fs = require('fs');
let input = fs.readFileSync('inputs/day02.txt', 'utf8').split('\n');

// Part 1
let score = 0;
for (let line of input) {
  const opponentMove = line[0];
  const myMove = String.fromCharCode(line.charCodeAt(2) - 23);
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
  const beats = {'C': 'B', 'B': 'A', 'A': 'C'};
  const moveScore = myMove.charCodeAt(0) - 64;
  let resultScore = 0 + (myMove === opponentMove ? 3 : beats[myMove] === opponentMove ? 6 : 0);
  return moveScore + resultScore;
}

function calculateMatchScore2(opponentMove, requiredResult) {
  const resultScore = (requiredResult.charCodeAt(0) - 'X'.charCodeAt(0)) * 3;
  const requiredMoves = {
    'A': {'X': 'C', 'Y': 'A', 'Z': 'B'},
    'B': {'X': 'A', 'Y': 'B', 'Z': 'C'},
    'C': {'X': 'B', 'Y': 'C', 'Z': 'A'}
  }
  const requiredMove = requiredMoves[opponentMove][requiredResult];
  const moveScore = requiredMove.charCodeAt(0) - 64;
  return resultScore + moveScore;
}