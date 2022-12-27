const fs = require('fs');
let input = fs.readFileSync('inputs/day24.txt', 'utf8')
    .split('\n');
input = input.slice(1, input.length - 1).map(row => row.slice(1, row.length - 1)); // ignore walls
const windSymbolMap = {'>': [0, 1], '<': [0, -1], 'v': [1, 0], '^': [-1, 0]};
// get winds
let winds = [];
for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
        if (input[i][j] !== '.') winds.push({coords: [i, j], symbol: input[i][j]});
    }
}

// Part 1
let coordsQueue = new Set(['-1:0']);
let goal = [input.length - 1, input[0].length - 1];
let steps = 0;
let shortestPathToGoal = getShortestPath();
console.log('Answer 1: ' + shortestPathToGoal);

// Part 2
coordsQueue = new Set([`${input.length}:${input[0].length - 1}`]);
goal = [0, 0];
steps = 0;
let shortestPathBackToStart = getShortestPath();

coordsQueue = new Set(['-1:0']);
goal = [input.length - 1, input[0].length - 1];
steps = 0;
let shortestPathBackToGoal = getShortestPath();
let totalSteps = shortestPathToGoal + shortestPathBackToStart + shortestPathBackToGoal;
console.log('Answer 2: ' + totalSteps);


function getShortestPath() {
    while (true) {
        steps++;
        // move winds
        let windRes = moveWinds(winds);
        winds = windRes[0];
        let windSet = windRes[1];
        // move every element of the queue to all available tiles
        let nextCoords = new Set();
        for (let coords of coordsQueue) {
            coords = getCoordsFromSetKey(coords);
            if (coords[0] === goal[0] && coords[1] === goal[1]) return steps;
            if (!windSet.has(`${coords[0] + 1}:${coords[1]}`) && isOnBoard([coords[0] + 1, coords[1]])) {
                nextCoords.add(`${coords[0] + 1}:${coords[1]}`);
            }
            if (!windSet.has(`${coords[0]}:${coords[1] + 1}`) && isOnBoard([coords[0], coords[1] + 1])) {
                nextCoords.add(`${coords[0]}:${coords[1] + 1}`);
            }
            if (!windSet.has(`${coords[0]}:${coords[1]}`) && isOnBoard([coords[0], coords[1]])) {
                nextCoords.add(`${coords[0]}:${coords[1]}`);
            }
            if (!windSet.has(`${coords[0] - 1}:${coords[1]}`) && isOnBoard([coords[0] - 1, coords[1]])) {
                nextCoords.add(`${coords[0] - 1}:${coords[1]}`)
            }
            if (!windSet.has(`${coords[0]}:${coords[1] - 1}`) && isOnBoard([coords[0], coords[1] - 1])) {
                nextCoords.add(`${coords[0]}:${coords[1] - 1}`);
            }
        }
        // replace queue
        coordsQueue = nextCoords;
    }
}


// function findShortestPath(coords, goal, winds, steps) {
//     if (coords[0] === goal[0] && coords[1] === goal[1]) {
//         if (steps < shortestPathSeen) shortestPathSeen = steps;
//         return steps;
//     }
//     if (getOptimumPath(coords, goal) + steps >= shortestPathSeen) {
//         return Infinity;
//     }
//     steps++;
//     let paths = [];
//     let [newWinds, windSet] = moveWinds(winds);
//     if (!windSet.has(`${coords[0] + 1}:${coords[1]}`) && isOnBoard([coords[0] + 1, coords[1]])) {
//         paths.push(findShortestPath([coords[0] + 1, coords[1]], goal, newWinds, steps));
//     }
//     if (!windSet.has(`${coords[0]}:${coords[1] + 1}`) && isOnBoard([coords[0], coords[1] + 1])) {
//         paths.push(findShortestPath([coords[0], coords[1] + 1], goal, newWinds, steps));
//     }
//     if (!windSet.has(`${coords[0]}:${coords[1]}`)) {
//         paths.push(findShortestPath([coords[0], coords[1]], goal, newWinds, steps));
//     }
//     if (!windSet.has(`${coords[0] - 1}:${coords[1]}`) && isOnBoard([coords[0] - 1, coords[1]])) {
//         paths.push(findShortestPath([coords[0] - 1, coords[1]], goal, newWinds, steps));
//     }
//     if (!windSet.has(`${coords[0]}:${coords[1] - 1}`) && isOnBoard([coords[0], coords[1] - 1])) {
//         paths.push(findShortestPath([coords[0], coords[1] - 1], goal, newWinds, steps));
//     }
//     return paths.length ? Math.min(...paths) : Infinity;
// }

function moveWinds(winds) {
    let newWinds = [...winds];
    let windSet = new Set();
    for (let wind of newWinds) {
        let windSymbolValue = windSymbolMap[wind.symbol];
        let newCoords = [wind.coords[0] + windSymbolValue[0], wind.coords[1] + windSymbolValue[1]];
        if (newCoords[0] < 0) {
            newCoords[0] = input.length - 1;
        } else if (newCoords[0] > input.length - 1) {
            newCoords[0] = 0;
        }
        if (newCoords[1] < 0) {
            newCoords[1] = input[0].length - 1;
        } else if (newCoords[1] > input[0].length - 1) {
            newCoords[1] = 0;
        }
        wind.coords = newCoords;
        windSet.add(`${newCoords[0]}:${newCoords[1]}`);
    }
    return [newWinds, windSet];
}

function getOptimumPath(coords, goal) {
    return Math.abs(goal[0] - coords[0]) + Math.abs(goal[1] - coords[1]);
}

function isOnBoard(coords) {
    return (coords[0] >= 0 && coords[0] < input.length && coords[1] >= 0 && coords[1] < input[0].length) ||
        (coords[0] === -1 && coords[1] === 0) ||
        (coords[0] === input.length && coords[1] === input[0].length - 1);
}

function printWinds(winds, h, w) {
    let grid = [];
    for (let i = 0; i < input.length; i++) {
        let row = [];
        for (let j = 0; j < input[0].length; j++) {
            row.push('.');
        }
        grid.push(row);
    }
    for (let wind of winds) {
        if (grid[wind.coords[0]][wind.coords[1]] === '.') {
            grid[wind.coords[0]][wind.coords[1]] = wind.symbol;
        } else if (typeof grid[wind.coords[0]][wind.coords[1]] !== "number") {
            grid[wind.coords[0]][wind.coords[1]] = 2;
        } else {
            grid[wind.coords[0]][wind.coords[1]]++;
        }
    }
    console.log(grid.map(row => row.join('')).join('\n'));
    console.log();
}

function getCoordsFromSetKey(setKey) {
    return setKey.split(':').map(coord => parseInt(coord));
}