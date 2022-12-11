const fs = require('fs');
let input = fs.readFileSync('inputs/day11.txt', 'utf8').split('\n');

function day11(pt, rounds) {
  let monkeys = [];
  let monkey;
  let lcm = 1;
  
  for (let i = 0; i < input.length; i++) {
    let rem = i % 7;
    switch(rem) {
      case 0:
        monkey = {inspections: 0};
        break;
      case 1:
        monkey.items = input[i].split(': ')[1].split(', ').map(num => parseInt(num));
        break;
      case 2:
        monkey.op = input[i].split('= ')[1].replaceAll("old", "item");
        break;
      case 3:
        const words3 = input[i].split(' ');
        monkey.test = parseInt(words3[words3.length - 1]);
        gcd *= monkey.test;
        break;
      case 4:
        const words4 = input[i].split(' ');
        monkey.trueDest = parseInt(words4[words4.length - 1]);
        break;
      case 5:
        const words5 = input[i].split(' ');
        monkey.falseDest = parseInt(words5[words5.length - 1]);
        monkeys.push(monkey);
        break;
    }
  }
  
  for (let i = 0; i < rounds; i++) {
    for (let j = 0; j < monkeys.length; j++) {
      const monkey = monkeys[j];
      for (let item of monkey.items) {
        monkey.inspections++;
        item = eval(monkey.op);
        if (pt === 1) {
          item = Math.floor(item / 3);
        } else {
          item = item % lcm; // we don't care about the actual number, just that it will be correctly routed through monkeys' tests
        }
        const destMonkey = item % monkey.test === 0 ? monkey.trueDest : monkey.falseDest;
        monkeys[destMonkey].items.push(item);
      }
      monkey.items = [];
    }
  }
  let ans = monkeys
    .map(m => m.inspections)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((acc, curr) => acc * curr, 1);
  console.log("Answer: " + ans);
}

day11(1, 20);
day11(2, 10_000);