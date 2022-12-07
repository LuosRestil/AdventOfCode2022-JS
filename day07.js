const fs = require('fs');
let input = fs.readFileSync('inputs/day07.txt', 'utf8').split('\n').slice(1); // ignore first line

// Part 1
let dirs = {
  '/': {
    size: 0,
    parent: null,
    children: {}
  }
}

let cwd = dirs['/'];

for(let line of input) {
  let words = line.split(' ');
  if (words[0] === '$') {
    if (words[1] === 'cd') {
      let destination = words[2];
      if (destination === '..') {
        cwd = cwd.parent;
      } else {
        cwd = cwd.children[destination];
      }
    }
  } else {
    if (words[0] === 'dir') {
      let dirName = words[1];
      cwd.children[dirName] = {
        type: 'dir',
        size: 0,
        parent: cwd,
        children: {}
      }
    } else {
      let size = parseInt(words[0]);
      cwd.size += size;
      let p = cwd;
      while (p.parent !== null) {
        p.parent.size += size;
        p = p.parent;
      }
    }
  }
}

function collectSizes(root, sizes) {
  sizes.push(root.size);
  let children = Object.keys(root.children);
  if (children.length !== 0) {
    for (let child of children) {
      collectSizes(root.children[child], sizes);
    }
  }
}
let sizes = [];
collectSizes(dirs['/'], sizes);
let answer = sizes.filter(size => size <= 100_000).reduce((acc, curr) => acc + curr);
console.log('Answer 1: ' + answer);

// Part 2
sizes.sort((a, b) => a - b);
const totalSpace = 70_000_000;
const usedSpace = sizes[sizes.length - 1];
const unusedSpace = totalSpace - usedSpace;
const requiredSpace = 30_000_000;
for (let size of sizes) {
  if (unusedSpace + size >= requiredSpace) {
    console.log('Answer 2: ' + size);
    break;
  }
}