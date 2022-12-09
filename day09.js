const fs = require('fs');
let input = fs.readFileSync('inputs/day09.txt', 'utf8')
  .split('\n')
  .map(line => {
    line = line.split(" ");
    return [line[0], parseInt(line[1])];
  });

moveRope(2);
moveRope(10);

function moveRope(ropeSize) {
  let rope = [];
  for (let i = 0; i < ropeSize; i++) {
    rope.push([0, 0]);
  }

  let visited = new Set();
  visited.add(JSON.stringify(rope[rope.length - 1]));

  for (let line of input) {
    const [cmd, dist] = [line[0], line[1]];
    for (let i = 0; i < dist; i++) {
      rope[0][0] += cmd === 'U' ? -1 : cmd === 'D' ? 1 : 0;
      rope[0][1] += cmd === 'L' ? -1 : cmd === 'R' ? 1 : 0;
      for (let j = 1; j < rope.length; j++) {
        closeDistance(rope[j - 1], rope[j]);
      }
      visited.add(JSON.stringify(rope[rope.length - 1]));
    }
  }
  console.log("Answer : " + visited.size);
}

function closeDistance(knot1, knot2) {
  const rowDist = knot1[0] - knot2[0];
  const colDist = knot1[1] - knot2[1];
  if (Math.abs(rowDist) > 1) {
    knot2[0] += rowDist < 0 ? -1 : 1;
    if (Math.abs(colDist) > 1) {
      knot2[1] += colDist < 0 ? -1 : 1;
    } else {
      knot2[1] = knot1[1];
    }
  } else if (Math.abs(colDist) > 1) {
    knot2[1] += colDist < 0 ? -1 : 1;
    knot2[0] = knot1[0];
  }
}