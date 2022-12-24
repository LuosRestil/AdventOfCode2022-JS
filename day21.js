const fs = require('fs');

let lines = fs.readFileSync('inputs/day21.txt', 'utf8')
    .split('\n');
let monkeys = {};
for (let line of lines) {
    let monkey = {};
    let split1 = line.split(': ');
    let monkeyName = split1[0];
    let monkeyVal = split1[1].split(' ');
    if (monkeyVal.length === 1) {
        monkey.value = parseInt(monkeyVal[0]);
    } else {
        monkey.value = null;
        monkey.operand1 = monkeyVal[0];
        monkey.operator = monkeyVal[1];
        monkey.operand2 = monkeyVal[2];
        monkey.operand1Value = null;
        monkey.operand2Value = null;
    }
    monkeys[monkeyName] = monkey;
}
console.log('Answer 1: ' + getMonkeyVal('root', monkeys));

monkeys = {};
for (let line of lines) {
    let monkey = {};
    let split1 = line.split(': ');
    let monkeyName = split1[0];
    let monkeyVal = split1[1].split(' ');
    if (monkeyVal.length === 1) {
        monkey.equation = monkeyName === 'humn' ? 'x' : monkeyVal[0];
    } else {
        monkey.equation = null;
        monkey.operand1 = monkeyVal[0];
        monkey.operator = monkeyName === 'root' ? '=' : monkeyVal[1];
        monkey.operand2 = monkeyVal[2];
        monkey.operand1Equation = null;
        monkey.operand2Equation = null;
    }
    monkeys[monkeyName] = monkey;
}
console.log('Equation: ' + getMonkeyEquation('root', monkeys));
// pass equation to equation solver program


function getMonkeyEquation(monkeyName, monkeys) {
    let monkey = monkeys[monkeyName];
    if (!monkey.equation) {
        let operand1 = monkey.operand1Equation ? monkey.operand1Equation : getMonkeyEquation(monkey.operand1, monkeys);
        let operand2 = monkey.operand2Equation ? monkey.operand2Equation : getMonkeyEquation(monkey.operand2, monkeys);
        let equation = `(${operand1} ${monkey.operator} ${operand2})`;
        try {
            monkey.equation = eval(equation);
        } catch (e) {
            monkey.equation = `(${operand1} ${monkey.operator} ${operand2})`;
        }
    }
    return monkey.equation;
}

function getMonkeyVal(monkeyName, monkeys) {
    let monkey = monkeys[monkeyName];
    if (!monkey.value) {
        let operand1 = monkey.operand1Value ? monkey.operand1Value : getMonkeyVal(monkey.operand1, monkeys);
        let operand2 = monkey.operand2Value ? monkey.operand2Value : getMonkeyVal(monkey.operand2, monkeys);
        monkey.value = eval(`${operand1} ${monkey.operator} ${operand2}`);
    }
    return monkey.value;
}