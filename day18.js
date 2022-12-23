const fs = require('fs');
const input = fs.readFileSync('inputs/day18.txt', 'utf8')
    .split('\n')
    .map(line => line.split(',').map(num => parseInt(num)));
let lava = {};
for (let line of input) {
    lava[`${line[0]}:${line[1]}:${line[2]}`] = {x: line[0], y: line[1], z: line[2]};
}

let uncovered = Object.keys(lava).length * 6;
for (let key in lava) {
    let cube = lava[key];
    let [x,y,z] = [cube.x, cube.y, cube.z];
    if (lava[`${x+1}:${y}:${z}`]) uncovered--;
    if (lava[`${x-1}:${y}:${z}`]) uncovered--;
    if (lava[`${x}:${y+1}:${z}`]) uncovered--;
    if (lava[`${x}:${y-1}:${z}`]) uncovered--;
    if (lava[`${x}:${y}:${z+1}`]) uncovered--;
    if (lava[`${x}:${y}:${z-1}`]) uncovered--;
}
console.log('Answer 1: ' + uncovered);

// get bounds of space
let [maxX, maxY, maxZ, minX, minY, minZ] = [0, 0, 0,Infinity, Infinity, Infinity];
for (let cube of Object.values(lava)) {
    maxX = Math.max(cube.x, maxX);
    maxY = Math.max(cube.y, maxY);
    maxZ = Math.max(cube.z, maxZ);
    minX = Math.min(cube.x, minX);
    minY = Math.min(cube.y, minY);
    minZ = Math.min(cube.z, minZ);
}
// allow air around edges of lava
maxX += 1;
maxY += 1;
maxZ += 1;
minX -= 1;
minY -= 1;
minZ -= 1;

// get air cubes, note adjacent lava cube faces
let uncovered2 = 0;
let air = new Set();
let queue = [`${minX}:${minY}:${minZ}`];
while (queue.length > 0) {
    let curr = queue.pop();
    let coords = curr.split(':').map(num => parseInt(num));
    air.add(curr);
    for (let neighbor of getNeighbors(coords[0], coords[1], coords[2])) {
        if (lava[neighbor]) {
            uncovered2++;
        } else {
            if (!air.has(neighbor) && !queue.includes(neighbor)) {
                queue.push(neighbor);
            }
        }
    }
}
console.log('Answer 2: ' + uncovered2);

function getNeighbors(x, y, z) {
    let neighbors = [];
    // adjacent x
    if (x > minX) neighbors.push(`${x-1}:${y}:${z}`);
    if (x < maxX) neighbors.push(`${x+1}:${y}:${z}`);
    // adjacent y
    if (y > minY) neighbors.push(`${x}:${y-1}:${z}`);
    if (y < maxY) neighbors.push(`${x}:${y+1}:${z}`);
    // adjacent z
    if (z > minZ) neighbors.push(`${x}:${y}:${z-1}`);
    if (z < maxZ) neighbors.push(`${x}:${y}:${z+1}`);
    return neighbors;
}