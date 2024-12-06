
import type { Vector } from './types/vector.ts';
import { readFile } from './utils/file-utils.ts';

const day = 6;

type preparedData = {
  map: string[][];
  guard: Vector;
}

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = {
    map: [],
    guard: {x: 0, y: 0}
  }

  for (let y = 0; y < data.length; y++) {
    retVal.map[y] = [...data[y]];
    if (retVal.map[y].indexOf('^') !== -1) {
      retVal.guard = {
        y,
        x: retVal.map[y].indexOf('^')
      }
    }
  }

  return retVal;
};

export function rotateVector(v: Vector, radians: number): Vector {
  return {
    x: Math.round(v.x * Math.cos(radians) - v.y * Math.sin(radians)),
    y: Math.round(v.x * Math.sin(radians) + v.y * Math.cos(radians))
  };
}

type Path = {
  resolved: boolean;
  path: Set<string>
}

function getPath(map: string[][], start: Vector, direction: Vector, match: string = '#'): Path {
  let resolved = false;
  const path: Set<string> = new Set();

  path.add(`${start.x},${start.y}`);

  let current: Vector = {...start};

  let count = 0;
  do {

    let next: Vector = {
      x: current.x + direction.x,
      y: current.y + direction.y
    };
  
    if (next.y < 0 || next.y >= map.length || next.x < 0 || next.x >= map[next.y].length) {
      resolved = true;
      break;
    }

    if (map[next.y][next.x] === match) {
      direction = rotateVector(direction, 1.570796)
      continue;
    }

    current = next;

    const posAsString = `${current.x},${current.y}`;
    if (path.has(posAsString)) {
      continue;
    }
    
    path.add(posAsString);
  } while(count++ < (map.length * map[0].length))

  return {
    resolved,
    path
  };
}

function exercise1(data: preparedData): number {
  const path = getPath(data.map, data.guard, {x:0, y:-1}, '#');
  return path.path.size
};

function exercise2(data: preparedData): number {
  let retVal = 0;
  const path = getPath(data.map, data.guard, {x:0, y:-1}, '#')
  for (const entry of path.path.values()) {

    const positionString = entry.split(',');
    const position: Vector = {
      x: parseInt(positionString[0]),
      y: parseInt(positionString[1])
    };
    
    // clone the map
    const map: string[][] = []
    for (let y = 0; y < data.map.length; y++) {
      map[y] = [...data.map[y]];
    }

    // update the position to be wall
    map[position.y][position.x] = '#';

    // check if the path resolves or loops
    const check = getPath(map, data.guard, {x:0, y:-1}, '#');
    if (!check.resolved) {
      retVal += 1;
    }

  }
  return retVal;
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test);
console.assert(answer === 41);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 4454);

// Exercise 2: Test Case
answer = exercise2(test);
console.assert(answer === 6);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 1503);