const fs = require('fs');
let input = fs.readFileSync('inputs/day16.txt', 'utf8').split('\n');

console.time('pt1');

// create graph
const graph = {};
for (let line of input) {
  let nodeName = line.split(' ')[1];
    let rate = parseInt(line.match(/rate=([0-9]+);/)[1]);
    let neighbors = line.match(/valves?\s(.+)/)[1].split(', ');
    graph[nodeName] = {rate, neighbors};
}

// get distances to each node
for (let nodeName in graph) {
  let distances = {};
  Object.keys(graph).forEach(key => {
    distances[key] = key === nodeName ? 0 : Infinity;
  })
  let unvisited = [nodeName];
  while (unvisited.length) {
    let curr = unvisited.pop();
    for (let neighbor of graph[curr].neighbors) {
      if (distances[neighbor] > distances[curr] + 1) {
        distances[neighbor] = distances[curr] + 1;
        unvisited.push(neighbor);
      }
    }
  }
  graph[nodeName].distances = distances;
}

const memo = {};

console.log('Answer 1: ' + traverse('AA', 0, 0, 30, []));
console.timeEnd('pt1');


function traverse(currentLoc, flowRate, totalFlow, timeRemaining, openValves) {
  if (!timeRemaining) {
    return totalFlow;
  }

  let totals = [];
  for (let nodeName in graph) {
    let node = graph[nodeName];
    if (
      !openValves.includes(nodeName) && // valve is closed
      node.distances[currentLoc] < timeRemaining - 1 && // valve is reachable in time remaining
      node.rate > 0 // valve can increase our total
      ) {
        let travelTime = node.distances[currentLoc];
        let newFlowRate = flowRate + node.rate;
        let newTotalFlow = totalFlow + (flowRate * (travelTime + 1));
        let newTimeRemaining = timeRemaining - travelTime - 1;
        // let total;
        // let cacheKey = `${nodeName}:${newFlowRate}:${newTotalFlow}:${newTimeRemaining}`;
        // if (cache[cacheKey]) {
        //   total = cache[cacheKey];
        // } else {
        //   total = traverse(nodeName, newFlowRate, newTotalFlow, newTimeRemaining, [...openValves, nodeName], cache);
        //   cache[cacheKey] = total;
        // }
        let total = traverse(nodeName, newFlowRate, newTotalFlow, newTimeRemaining, [...openValves, nodeName]);
        totals.push(total);
    }
  }

  let ans;
  if (totals.length > 0) {
    ans = totals.sort((a, b) => b - a)[0];
  } else {
    ans = totalFlow + (timeRemaining * flowRate);
  }
  return ans;
}

/*
Sample
Part 1: 1651
Part 2: 1707

Sample2
Part 1: 2640
Part 2: 2670

Sample3
Part 1: 13468
Part 2: 12887

Sample4
Part 1: 1288
Part 2: 1484

Sample5
Part 1: 2400
Part 2: 3680
*/