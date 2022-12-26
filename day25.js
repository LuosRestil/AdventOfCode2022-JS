const fs = require('fs');
let charMap = {'0': 0, '1': 1, '2': 2, '-': -1, '=': -2};
let reverseCharMap = ['=', '-', '0', '1', '2'];
let snafus = fs.readFileSync('inputs/day25.txt', 'utf8').split('\n').map(snafu => snafu.split('').map(char => charMap[char]));;
let total = 0;
for (let snafu of snafus) {
    total += snafuToDecimal(snafu);
}
console.log('Answer 1: ' + decimalToSnafu(total));

function snafuToDecimal(snafu) {
    let total = 0;
    for (let i = 0; i < snafu.length; i++) {
        let place = snafu.length - 1 - i;
        total += Math.pow(5, place) * snafu[i];
    }
    return total;
}

function decimalToSnafu(decimal) {
    let snafu = [];
    let maxPower = 0;
    while (getMaxDecimal(maxPower) < decimal) {
        maxPower++;
    }
    for (let i = maxPower; i >= 0; i--) {
        let maxDecimalAfterCurr = getMaxDecimal(i - 1);
        for (let j = -2; j <= 2; j++) {
            let placeValue = Math.pow(5, i) * j;
            if (maxDecimalAfterCurr >= decimal - placeValue) {
                snafu.push(j);
                decimal -= placeValue;
                break;
            }
        }
    }
    return snafu.map(num => reverseCharMap[num + 2]).join('');
}

function getMaxDecimal(power) {
    if (power < 0) return 0;
    let total = 0;
    for (let i = 0; i <= power; i++) {
        total += Math.pow(5, i) * 2;
    }
    return total;
}

module.exports.snafuToDecimal = snafuToDecimal;
module.exports.decimalToSnafu = decimalToSnafu;
module.exports.charMap = charMap;
