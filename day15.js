const fs = require('fs');
const infile = 'inputs/day15.txt';
let input = fs.readFileSync(infile, 'utf8').split('\n');

const rowToExamine = infile.includes('Sample') ? 10 : 2_000_000;
const pt2Limit = infile.includes('Sample') ? 20 : 4_000_000;

let [minX, maxX, minY, maxY] = [Infinity, -Infinity, Infinity, -Infinity];

let sensors = [];
let beacons = [];

for (let line of input) {
  let xCoords = [...line.matchAll(/x=(-?[0-9]+)/g)];
  let yCoords = [...line.matchAll(/y=(-?[0-9]+)/g)];
  let sensor = {x: parseInt(xCoords[0][1]), y: parseInt(yCoords[0][1])};
  let beacon = {x: parseInt(xCoords[1][1]), y: parseInt(yCoords[1][1])};
  let dist = manhattanDistance(sensor, beacon);
  sensor.dist = dist;
  sensor.maxX = sensor.x + sensor.dist;
  sensor.minX = sensor.x - sensor.dist;
  sensor.maxY = sensor.y + sensor.dist;
  sensor.minY = sensor.y - sensor.dist;
  sensors.push(sensor);
  beacons.push(beacon);
  if (sensor.x - dist < minX) minX = sensor.x - dist;
  if (sensor.x + dist > maxX) maxX = sensor.x + dist;
  if (sensor.y - dist < minY) minY = sensor.y - dist;
  if (sensor.y + dist > maxY) maxY = sensor.y + dist;
}

// Part 1
let count = 0;
for (let x = minX; x <= maxX; x++) {
  let point = {x: x, y: rowToExamine};
  if (cannotBeBeacon(point)) {
    count++;
  }
}

console.log('Answer 1: ' + count);

// Part 2
let beaconLoc = findUndiscoveredBeacon();
console.log('Answer 2: ' + getTuningFrequency(beaconLoc));


function findUndiscoveredBeacon() {
  for (let sensor of sensors) {
    // check around edges of sensor
    // upper left
    let x = sensor.minX - 1;
    let y = (sensor.maxY + sensor.minY) / 2;
    while (x <= (sensor.maxX + sensor.minX) / 2 && y <= sensor.maxY + 1) {
      let point = {x, y};
      if (inRange(point) && !coveredBySensor(point)) return point;
      x++;
      y++;
    }
    // lower left
    x = sensor.minX - 1;
    y = (sensor.maxY + sensor.minY) / 2;
    while (x <= (sensor.maxX + sensor.minX) / 2 && y >= sensor.minY - 1) {
      let point = {x, y};
      if (inRange(point) && !coveredBySensor(point)) return point;
      x++;
      y--;
    }
    // upper right
    x = (sensor.maxX + sensor.minX) / 2;
    y = sensor.maxY + 1;
    while (x <= sensor.maxX + 1 && y >= (sensor.maxY + sensor.minY) / 2) {
      let point = {x, y};
      if (inRange(point) && !coveredBySensor(point)) return point;
      x++;
      y--;
    }
    // lower right
    x = (sensor.maxX + sensor.minX) / 2;
    y = sensor.minY - 1;
    while (x <= sensor.maxX + 1 && y <= (sensor.maxY + sensor.minY) / 2) {
      let point = {x, y};
      if (inRange(point) && !coveredBySensor(point)) return point;
      x++;
      y++;
    }
  }
}

function manhattanDistance(point1, point2) {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

function cannotBeBeacon(point) {
  if (beacons.some(beacon => pointsAreEqual(beacon, point))) {
    return false;
  }
  return coveredBySensor(point);
}

function pointsAreEqual(point1, point2) {
  return point1.x === point2.x && point1.y === point2.y;
}

function coveredBySensor(point) {
  for (let sensor of sensors) {
    const pointToSensorDist = manhattanDistance(point, sensor);
    if (pointToSensorDist <= sensor.dist) {
      return true
    }
  }
  return false;
}

function inRange(point) {
  return point.x >= 0 && 
         point.x <= pt2Limit &&
         point.y >= 0 &&
         point.y <= pt2Limit;
}

function getTuningFrequency(point) {
  return (point.x * 4_000_000) + point.y;
}