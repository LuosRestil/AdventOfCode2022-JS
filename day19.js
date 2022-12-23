const fs = require('fs');

const blueprints = fs.readFileSync('inputs/day19.txt', 'utf8')
    .split('\n')
    .map(line => [...line.matchAll(/[0-9]+/g)].map(res => parseInt(res[0])))
    .map(nums => {
        let [number, oreBotCost, clayBotCost, obsidianBotCostOre, obsidianBotCostClay, geodeBotCostOre, geodeBotCostObsidian] = nums;
        return {
            number, oreBotCost, clayBotCost, obsidianBotCostOre, obsidianBotCostClay, geodeBotCostOre, geodeBotCostObsidian,
            maxOreCost: Math.max(oreBotCost, clayBotCost, obsidianBotCostOre),
            maxClayCost: Math.max(obsidianBotCostClay, geodeBotCostOre),
            maxObsidianCost: geodeBotCostObsidian
        }
    });

console.time('runtime1');
let totalQuality = 0;
let maxGeodesSeen;
for (let blueprint of blueprints) {
    let cache = new Map();
    maxGeodesSeen = 0;
    const maxGeodes = findMaxGeodes(blueprint, {ore: 0, clay: 0, obsidian: 0, geodes: 0, oreBots: 1, clayBots: 0, obsidianBots: 0, geodeBots: 0,time: 24}, cache);
    const qualityLevel = maxGeodes * blueprint.number;
    totalQuality += qualityLevel;
}
console.log('Answer 1: ' + totalQuality);
console.timeEnd('runtime1');

console.time('runtime2');
let total = 1;
for (let blueprint of blueprints.slice(0,3)) {
    let cache = new Map();
    maxGeodesSeen = 0;
    total *= findMaxGeodes(blueprint, {ore: 0, clay: 0, obsidian: 0, geodes: 0, oreBots: 1, clayBots: 0, obsidianBots: 0, geodeBots: 0,time: 32}, cache);
}
console.log('Answer 2: ' + total);
console.timeEnd('runtime2');

function findMaxGeodes(blueprint, state, cache) {
    if (state.time === 0) {
        if (state.geodes > maxGeodesSeen) {
            maxGeodesSeen = state.geodes;
        }
        return state.geodes;
    }
    if (estimateBestCase(state) <= maxGeodesSeen) {
        return 0;
    }
    const cacheKey = `${state.ore}:${state.clay}:${state.obsidian}:${state.geodes}:${state.oreBots}:${state.clayBots}:${state.obsidianBots}:${state.time}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)
    }
    let nextBotState, makeOreBot, makeClayBot, makeObsidianBot, makeGeodeBot;
    let branching = false;
    nextBotState = getNextGeodeBotState(blueprint, state);
    if (nextBotState) {
        branching = true;
        nextBotState = advanceState(nextBotState);
        nextBotState.ore -= blueprint.geodeBotCostOre;
        nextBotState.obsidian -= blueprint.geodeBotCostObsidian;
        nextBotState.geodeBots++;
        makeGeodeBot = findMaxGeodes(blueprint, {...nextBotState}, cache);
    }
    nextBotState = getNextObsidianBotState(blueprint, state);
    if (nextBotState) {
        branching = true;
        nextBotState = advanceState(nextBotState);
        nextBotState.ore -= blueprint.obsidianBotCostOre;
        nextBotState.clay -= blueprint.obsidianBotCostClay;
        nextBotState.obsidianBots++;
        makeObsidianBot = findMaxGeodes(blueprint, {...nextBotState}, cache);
    }
    nextBotState = getNextClayBotState(blueprint, state);
    if (nextBotState) {
        branching = true;
        nextBotState = advanceState(nextBotState);
        nextBotState.ore -= blueprint.clayBotCost;
        nextBotState.clayBots++;
        makeClayBot = findMaxGeodes(blueprint, {...nextBotState}, cache);
    }
    nextBotState = getNextOreBotState(blueprint, state);
    if (nextBotState) {
        branching = true;
        nextBotState = advanceState(nextBotState);
        nextBotState.ore -= blueprint.oreBotCost;
        nextBotState.oreBots++;
        makeOreBot = findMaxGeodes(blueprint, {...nextBotState}, cache);
    }
    if (!branching) {
        // we can't build any more bots from this point, so just run down the clock
        let finalState = {...state};
        while (finalState.time > 0) {
            finalState = advanceState(finalState);
        }
        cache.set(cacheKey, finalState.geodes);
        // return finalState.geodes;
    } else {
        cache.set(cacheKey, Math.max(makeOreBot || 0, makeClayBot || 0, makeObsidianBot || 0, makeGeodeBot || 0));
        // return Math.max(makeOreBot || 0, makeClayBot || 0, makeObsidianBot || 0, makeGeodeBot || 0);
    }
    return cache.get(cacheKey);
}

function advanceState(state) {
    return {
        ...state,
        ore: state.ore + state.oreBots,
        clay: state.clay + state.clayBots,
        obsidian: state.obsidian + state.obsidianBots,
        geodes: state.geodes + state.geodeBots,
        time: state.time - 1
    }
}

function getNextGeodeBotState(blueprint, state) {
    let nextGeodeBotState = {...state};
    while ((blueprint.geodeBotCostObsidian > nextGeodeBotState.obsidian || blueprint.geodeBotCostOre > nextGeodeBotState.ore) && nextGeodeBotState.time > 0) {
        nextGeodeBotState = advanceState(nextGeodeBotState);
    }
    if (nextGeodeBotState.time > 0) {
        return nextGeodeBotState;
    }
}

function getNextObsidianBotState(blueprint, state) {
    if (state.obsidianBots === blueprint.maxObsidianCost) return null;
    let nextObsidianBotState = {...state};
    while ((blueprint.obsidianBotCostOre > nextObsidianBotState.ore || blueprint.obsidianBotCostClay > nextObsidianBotState.clay) && nextObsidianBotState.time > 0) {
        nextObsidianBotState = advanceState(nextObsidianBotState);
    }
    if (nextObsidianBotState.time > 0) {
        return nextObsidianBotState;
    }
}

function getNextClayBotState(blueprint, state) {
    if (state.clayBots === blueprint.maxClayCost) return null;
    let nextClayBotState = {...state};
    while (blueprint.clayBotCost > nextClayBotState.ore && nextClayBotState.time > 0) {
        nextClayBotState = advanceState(nextClayBotState);
    }
    if (nextClayBotState.time > 0) {
        return nextClayBotState;
    }
}

function getNextOreBotState(blueprint, state) {
    if (state.oreBots === blueprint.maxOreCost) return null;
    let nextOreBotState = {...state};
    while (blueprint.oreBotCost > nextOreBotState.ore && nextOreBotState.time > 0) {
        nextOreBotState = advanceState(nextOreBotState);
    }
    if (nextOreBotState.time > 0) {
        return nextOreBotState;
    }
}

function estimateBestCase(state) {
    let nextState = {...state};
    while (nextState.time > 0) {
        nextState.geodeBots++;
        nextState = advanceState(nextState);
    }
    return nextState.geodes;
}