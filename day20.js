const fs = require('fs');

// Part 1
let nums = fs.readFileSync('inputs/day20.txt', 'utf8')
    .split('\n')
    .map(num => {return {val: parseInt(num)}});

let mix = [...nums];
doMix();
let groveCoords = getGroveCoords();
console.log('Answer 1: ' + groveCoords);

// Part 2
const decryptionKey = 811_589_153;
nums = nums.map(num => {return {val: num.val * decryptionKey}});
mix = [...nums]
for (let i = 0; i < 10; i++) {
    doMix();
}
groveCoords = getGroveCoords();
console.log('Answer 2: ' + groveCoords);


function doMix() {
    for (let i = 0; i < nums.length; i++) {
        let target = nums[i];
        // find item in mix
        let src = mix.indexOf(target);
        // move item required spaces
        let dest = src + (target.val % (nums.length - 1));
        if (target.val < 0) {
            while (dest <= 0) {
                dest += nums.length - 1;
            }
        } else {
            while (dest >= nums.length - 1) {
                dest -= nums.length - 1;
            }
        }
        if (dest > src) {
            dest++;
        }
        mix.splice(dest, 0, target);
        if (dest < src) {
            src++;
        }
        mix.splice(src,1);
    }
}

function getGroveCoords() {
    let groveCoords = 0;
    let zeroIdx = mix.findIndex(num => num.val === 0);
    for (let i = 1000; i <= 3000; i += 1000) {
        let idx = i % mix.length + zeroIdx;
        if (idx > mix.length - 1) {
            idx -= mix.length;
        }
        groveCoords += mix[idx].val;
    }
    return groveCoords;
}