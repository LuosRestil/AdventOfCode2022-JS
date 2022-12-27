const fs = require('fs');
let grid = fs.readFileSync('inputs/day23Sample.txt', 'utf8')
    .split('\n');

let elves = new Map();
for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] === '#') {
            elves.set(`${i}:${j}`, null);
        }
    }
}

let proposalDirs = ['N', 'S', 'W', 'E'];
let elfGrids = [];
// Part 1
for (let round = 0; round < 10; round++) {
// Part 2
// for (let round = 0; true; round++) {

    // proposal phase
    let proposals = new Map();
    for (let elf of elves.keys()) {
        let elfCoords = getElfCoords(elf);
        // check all sides
        if (!isIsolated(elfCoords)) {
            // make proposal
            for (let proposalDir of proposalDirs) {
                let otherElfFound = false;
                if (proposalDir === 'N') {
                    // check above
                    for (let i = -1; i <= 1; i++) {
                        if (elves.has(`${elfCoords[0] - 1}:${elfCoords[1] + i}`)) {
                            otherElfFound = true;
                            break;
                        }
                    }
                    if (!otherElfFound) {
                        let proposal = `${elfCoords[0] - 1}:${elfCoords[1]}`;
                        elves.set(elf, proposal);
                        proposals.set(proposal, (proposals.get(proposal) || 0) + 1);
                        break;
                     }
                } else if (proposalDir === 'S') {
                    // check below
                    for (let i = -1; i <= 1; i++) {
                        if (elves.has(`${elfCoords[0] + 1}:${elfCoords[1] + i}`)) {
                            otherElfFound = true;
                            break;
                        }
                    }
                    if (!otherElfFound) {
                        let proposal = `${elfCoords[0] + 1}:${elfCoords[1]}`;
                        elves.set(elf, proposal);
                        proposals.set(proposal, (proposals.get(proposal) || 0) + 1);
                        break;
                    }
                } else if (proposalDir === 'E') {
                    // check right
                    for (let i = -1; i <= 1; i++) {
                        if (elves.has(`${elfCoords[0] + i}:${elfCoords[1] + 1}`)) {
                            otherElfFound = true;
                            break;
                        }
                    }
                    if (!otherElfFound) {
                        let proposal = `${elfCoords[0]}:${elfCoords[1] + 1}`;
                        elves.set(elf, proposal);
                        proposals.set(proposal, (proposals.get(proposal) || 0) + 1);
                        break;
                    }
                } else { // proposal dir is 'W'
                    for (let i = -1; i <= 1; i++) {
                        if (elves.has(`${elfCoords[0] + i}:${elfCoords[1] - 1}`)) {
                            otherElfFound = true;
                            break;
                        }
                    }
                    if (!otherElfFound) {
                        let proposal = `${elfCoords[0]}:${elfCoords[1] - 1}`;
                        elves.set(elf, proposal);
                        proposals.set(proposal, (proposals.get(proposal) || 0) + 1);
                        break;
                    }
                }

            }
        }
    }
    // movement phase
    for (let elf of elves.keys()) {
        if (proposals.get(elves.get(elf)) === 1) {
            elves.set(elves.get(elf), null);
            elves.delete(elf);
        }
    }

    // Part 2 only
    // if ([...elves.keys()].map(elf => getElfCoords(elf)).every(elfCoords => isIsolated(elfCoords))) {
    //     console.log('Answer 2: ' + (round + 2));
    //     break;
    // }

    // clear proposals of unmoved elves
    for (let elf of elves.keys()) {
        elves.set(elf, null);
    }
    // advance proposal directions
    proposalDirs = [...proposalDirs.slice(1), proposalDirs[0]];
}

// get min row, max row, min col, max col
let [minRow, maxRow, minCol, maxCol] = [Infinity, -Infinity, Infinity, -Infinity];
for (let elf of elves.keys()) {
    let elfCoords = elf.split(':').map(num => parseInt(num));
    if (elfCoords[0] < minRow) minRow = elfCoords[0];
    if (elfCoords[0] > maxRow) maxRow = elfCoords[0];
    if (elfCoords[1] < minCol) minCol = elfCoords[1];
    if (elfCoords[1] > maxCol) maxCol = elfCoords[1];
}
// find empty spaces
let area = (maxRow - minRow + 1) * (maxCol - minCol + 1);
console.log('Answer 1: ' + (area - elves.size));


function isIsolated(elfCoords) {
    for (let row = -1; row <= 1; row++) {
        for (let col = -1; col <= 1; col++) {
            if (row === 0 && col === 0) continue;
            if (elves.has(`${elfCoords[0] + row}:${elfCoords[1] + col}`)) {
                return false
            }
        }
    }
    return true;
}

function getElfCoords(elf) {
    return elf.split(':').map(num => parseInt(num));
}