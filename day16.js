const fs = require('fs');
let input = fs.readFileSync('inputs/day16.txt', 'utf8').split('\n');

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
// remove unnecessary nodes
for (let nodeName in graph) {
  if (graph[nodeName].rate === 0) {
    delete graph[nodeName];
  }
}

console.log('Answer 1: ' + JSON.stringify(traverse('AA', 0, 0, 30, [], graph)));

// Part 2
let paths = findPaths(Object.keys(graph))
  .map(path => {
    let pathGraph = {};
    for (let room of path) {
      pathGraph[room] = graph[room];
    }
    return {value: traverse('AA', 0, 0, 26, [], pathGraph), path};
  });

let max = 0;
for (let i = 0; i < paths.length - 1; i++) {
  for (let j = i + 1; j < paths.length; j++) {
    if (paths[i].path.every(room => !paths[j].path.includes(room))) {
      let total = paths[i].value + paths[j].value;
      if (total > max) {
        max = total;
      }
    }
  }
}

console.log('Answer 2: ' + max);


function traverse(currentLoc, flowRate, totalFlow, timeRemaining, openValves, graph) {
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
        let newOpenValves = [...openValves, nodeName];
        let total = traverse(nodeName, newFlowRate, newTotalFlow, newTimeRemaining, newOpenValves, graph);
        totals.push(total);
    }
  }
  return totals.length > 0 ? totals.sort((a, b) => b - a)[0] : totalFlow + (timeRemaining * flowRate);
}

function findPaths(set) {
  let paths = [];
  for (let i = 0; i < Math.pow(2, set.length); i++) {
    let bin = i.toString(2).padStart(set.length, '0');
    let path = [];
    for (let j = 0; j < bin.length; j++) {
      if (bin[j] === '1') {
        path.push(set[j]);
      }
    }
    paths.push(path);
  }
  return paths;
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