const fs = require('fs');
let infile = 'inputs/day22.txt';
let input = fs.readFileSync(infile, 'utf8').split('\n\n');
let instructions = [...input[1].matchAll(/[0-9]+|[LR]+/g)].map(match => match[0]);
for (let i = 0; i < instructions.length; i++) {
    if (i % 2 === 0) {
        instructions[i] = {type: 'move', val: parseInt(instructions[i])};
    } else {
        instructions[i] = {type: 'turn', val: instructions[i] === 'R' ? 1 : -1};
    }
}
let grid = input[0].split('\n');

// pad short lines for uniform grid dimensions
let maxLineLength = 0;
for (let line of grid) {
    if (line.length > maxLineLength) {
        maxLineLength = line.length;
    }
}
for (let i = 0; i < grid.length; i++) {
    let lineLen = grid[i].length;
    if (lineLen < maxLineLength) {
        let diff = maxLineLength - lineLen;
        let pad = [];
        for (let j = 0; j < diff; j++) {
            pad.push(' ');
        }
        grid[i] += pad.join('');
    }
}

// find row and column boundaries
let bounds = {rows: {}, cols: {}};
// rows
for (let i = 0; i < grid.length; i++) {
    bounds.rows[i] = {lower: null, upper: null};
    for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] !== ' ') { // current index has a character
            if (bounds.rows[i].lower === null) {
                bounds.rows[i].lower = j;
            }
        } else { // current index is blank
            if (j > 0 && grid[i][j - 1] !== ' ') { // previous index has a character
                bounds.rows[i].upper = j - 1;
            }
        }
    }
    if (bounds.rows[i].upper === null) { // last index has a character
        bounds.rows[i].upper = grid[0].length - 1;
    }
}
// cols
for (let i = 0; i < grid[0].length; i++) {
    bounds.cols[i] = {lower: null, upper: null};
    for (let j = 0; j < grid.length; j++) {
        if (grid[j][i] !== ' ') { // current index has a character
            if (bounds.cols[i].lower === null) {
                bounds.cols[i].lower = j;
            }
        } else { // current index is blank
            if (j > 0 && grid[j - 1][i] !== ' ') { // previous index has a character
                bounds.cols[i].upper = j - 1;
            }
        }
    }
    if (bounds.cols[i].upper === null) { // last index has a character
        bounds.cols[i].upper = grid.length - 1;
    }
}
const faceSize = infile.includes('Sample') ? 4 : 50;
let curr = {row: 0, col: bounds.rows[0].lower};
let heading = 0;
traipse(tryWrap1);

grid = input[0].split('\n');
const INSTRUCTIONS = {invertRow: 'invertrow', swapRowCol: 'swaprowcol'};
let faces = [
    {
        start: [0, faceSize],
        next: {
            2: {
                dest: 4,
                heading: 0,
                inst: INSTRUCTIONS.invertRow},
            3: {
                dest: 5,
                heading: 0,
                inst: INSTRUCTIONS.swapRowCol
            }
        }
    },
    {
        start: [0, faceSize * 2],
        next: {
            0: {
                dest: 3,
                heading: 2,
                inst: INSTRUCTIONS.invertRow
            },
            1: {
                dest: 2,
                heading: 2,
                inst: INSTRUCTIONS.swapRowCol
            },
            3: {
                dest: 5,
                heading: 3,
                inst: INSTRUCTIONS.invertRow
            }
        }
    },
    {
        start: [faceSize, faceSize],
        next: {
            0: {
                dest: 1,
                heading: 3,
                inst: INSTRUCTIONS.swapRowCol
            },
            2: {
                dest: 4,
                heading: 1,
                inst: INSTRUCTIONS.swapRowCol
            }
        }
    },
    {
        start: [faceSize * 2, faceSize],
        next: {
            0: {
                dest: 1,
                heading: 2,
                inst: INSTRUCTIONS.invertRow
            },
            1: {
                dest: 5,
                heading: 2,
                inst: INSTRUCTIONS.swapRowCol
            }
        }
    },
    {
        start: [faceSize * 2, 0],
        next: {
            2: {
                dest: 0,
                heading: 0,
                inst: INSTRUCTIONS.invertRow
            },
            3: {
                dest: 2,
                heading: 0,
                inst: INSTRUCTIONS.swapRowCol
            }
        }
    },
    {
        start: [faceSize * 3, 0],
        next: {
            0: {
                dest: 3,
                heading: 3,
                inst: INSTRUCTIONS.swapRowCol
            },
            1: {
                dest: 1,
                heading: 1,
                inst: INSTRUCTIONS.invertRow
            },
            2: {
                dest: 0,
                heading: 1,
                inst: INSTRUCTIONS.swapRowCol
            }
        }
    }
];

curr = {row: 0, col: bounds.rows[0].lower};
heading = 0;
traipse(tryWrap2);

function traipse(tryWrap) {
    for (let instruction of instructions) {
        if (instruction.type === 'turn') {
            // turn
            heading += instruction.val;
            if (heading < 0) heading = 3;
            else if (heading > 3) heading = 0;
        } else {
            // travel distance
            for (let i = 0; i < instruction.val; i++) {
                let nextRow = curr.row;
                let nextCol = curr.col;
                if (heading === 0) { // >
                    nextCol++;
                } else if (heading === 1) { // v
                    nextRow++;
                } else if (heading === 2) { // <
                    nextCol--;
                } else { // ^
                    nextRow--;
                }
                let res = tryWrap(nextRow, nextCol);
                if (grid[res.nextRow][res.nextCol] !== '#') {
                    curr.row = res.nextRow;
                    curr.col = res.nextCol;
                    heading = res.nextHeading;
                } else {
                    break;
                }
            }
        }
    }
    let ans = ((curr.row + 1) * 1000) + ((curr.col + 1) * 4) + heading;
    console.log('Answer: ' + ans);
}


function tryWrap1(nextRow, nextCol) {
    let rowBounds = bounds.rows[curr.row];
    let colBounds = bounds.cols[curr.col];
    let nextHeading = heading;
    if (nextRow > colBounds.upper) {
        nextRow = colBounds.lower;
    } else if (nextRow < colBounds.lower) {
        nextRow = colBounds.upper;
    } else if (nextCol > rowBounds.upper) {
        nextCol = rowBounds.lower;
    } else if (nextCol < rowBounds.lower) {
        nextCol = rowBounds.upper;
    }
    return {nextRow, nextCol, nextHeading};
}

function tryWrap2(nextRow, nextCol) {
    let rowBounds = bounds.rows[curr.row];
    let colBounds = bounds.cols[curr.col];
    let nextHeading = heading;
    if (nextRow > colBounds.upper || nextRow < colBounds.lower || nextCol > rowBounds.upper || nextCol < rowBounds.lower) {
        let face = findCurrentFace(curr.row, curr.col);
        let [faceRow, faceCol] = [curr.row - face.start[0], curr.col - face.start[1]];
        let nextFace = faces[face.next[heading].dest];
        let [nextFaceRow, nextFaceCol] = [faceRow, faceCol];
        if (face.next[heading].inst === INSTRUCTIONS.invertRow) {
            nextFaceRow = faceSize - 1 - faceRow;
        } else { // swaprowcol
            nextFaceRow = faceCol;
            nextFaceCol = faceRow;
        }
        [nextRow, nextCol] = [nextFaceRow + nextFace.start[0], nextFaceCol + nextFace.start[1]];
        nextHeading = face.next[heading].heading;
    }
    return {nextRow, nextCol, nextHeading};
}

function findCurrentFace(row, col) {
    for (let i = 0; i < faces.length; i++) {
        let face = faces[i];
        if (row >= face.start[0] && row < face.start[0] + faceSize && col >= face.start[1] && col < face.start[1] + faceSize) {
            return faces[i];
        }
    }
}