
import type { Vector } from './types/vector.ts';
import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';

const day = 6;

type preparedData = {
  map: string[][];
  guard: Vector;
}

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = {
    map: [],
    guard: vu.create(0, 0)
  }

  for (let y = 0; y < data.length; y++) {
    retVal.map[y] = [...data[y]];
    if (retVal.map[y].indexOf('^') !== -1) {
      retVal.guard = vu.create(retVal.map[y].indexOf('^'), y);
    }
  }

  return retVal;
};

type Path = {
  resolved: boolean;
  path: Set<string>
}

function getPath(map: string[][], start: Vector, direction: Vector, match: string = '#'): Path {
  let resolved = false;
  const path: Set<string> = new Set();

  path.add(vu.toString(start));

  let current: Vector = {...start};

  let count = 0;
  do {

    let next: Vector = vu.add(current, direction);
  
    if (!au.isInBounds2d(map, next)) {
      resolved = true;
      break;
    }

    if (map[next.y][next.x] === match) {
      direction = vu.round(vu.rotate(direction, 1.570796));
      continue;
    }

    current = next;
    
    path.add(vu.toString(current));
  } while(count++ < (map.length * map[0].length))

  return {
    resolved,
    path
  };
}

function exercise1(data: preparedData): number {
  const path = getPath(data.map, data.guard, vu.create(0, -1), '#');
  return path.path.size
};

function exercise2(data: preparedData): number {
  let retVal = 0;
  const path = getPath(data.map, data.guard, vu.create(0, -1), '#')
  for (const entry of path.path.values()) {

    const position = vu.fromString(entry) as Vector;
    
    // clone the map
    const map: string[][] = au.clone2d(data.map);

    // update the position to be wall
    map[position.y][position.x] = '#';

    // check if the path resolves or loops
    const check = getPath(map, data.guard, vu.create(0, -1), '#');
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