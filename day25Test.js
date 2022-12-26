let {snafuToDecimal, decimalToSnafu, charMap} = require('./day25');

let conversions1 = `        1              1
        2              2
        3             1=
        4             1-
        5             10
        6             11
        7             12
        8             2=
        9             2-
       10             20
       15            1=0
       20            1-0
     2022         1=11-2
    12345        1-0---0
314159265  1121-1110-1=0`
    .split('\n')
    .map(line => [...line.matchAll(/[0-9-=]+/g)].map(match => match[0]))
    .map(line => {return {decimal: line[0], snafu: line[1]}});
let conversions2= `1=-0-2     1747
 12111      906
  2=0=      198
    21       11
  2=01      201
   111       31
 20012     1257
   112       32
 1=-1=      353
  1-12      107
    12        7
    1=        3
   122       37`
    .split('\n')
    .map(line => [...line.matchAll(/[0-9-=]+/g)].map(match => match[0]))
    .map(line => {return {decimal: line[1], snafu: line[0]}});
let conversions = [...conversions1, ...conversions2];

let snafuToDecimalTestFailed = false;
for (let conversion of conversions) {
    let expected = parseInt(conversion.decimal);
    let actual = snafuToDecimal(conversion.snafu.split('').map(char => charMap[char]));
    if (expected !== actual) {
        console.error(`FAILED: snafuToDecimal(${conversion.snafu}), EXPECTED: ${expected}, ACTUAL: ${actual}`);
        snafuToDecimalTestFailed = true;
    }
}
if (!snafuToDecimalTestFailed) {
    console.log('TESTS PASSED');
}

let decimalToSnafuTestFailed = false;
for (let conversion of conversions) {
    let expected = conversion.snafu;
    let actual = decimalToSnafu(parseInt(conversion.decimal));
    if (expected !== actual) {
        console.error(`FAILED: snafuToDecimal(${conversion.decimal}), EXPECTED: ${expected}, ACTUAL: ${actual}`);
        decimalToSnafuTestFailed = true;
    }
}
if (!decimalToSnafuTestFailed) {
    console.log('TESTS PASSED');
}