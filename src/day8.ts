import type { Vector } from './types/vector.ts';
import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';

const day = 8;

type preparedData = string[][]

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];

  for (const line of data) {
    retVal.push([...line]);
  }

  return retVal;
};


function getTransmitters(data: preparedData): Map<string, Vector[]> {
  const retVal: Map<string, Vector[]> = new Map<string, Vector[]>();
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x] === '.')
        continue;
      if (retVal.has(data[y][x])) {
        retVal.set(data[y][x], [...retVal.get(data[y][x]) as Vector[], {x, y}]);
      } else {
        retVal.set(data[y][x], [{x, y}]);
      }
    }
  }
  return retVal;
}

function exercise1(data: preparedData): number {
  const retVal: Set<string> = new Set<string>();

  const transmitters: Map<string, Vector[]> = getTransmitters(data);

  for (const values of transmitters.values()) {
    for (let i = 0; i < values.length; i++) {
      for (let ii = 0; ii < values.length; ii++) {
        if (ii === i)
          continue;

        const delta: Vector = vu.subtract(values[ii], values[i]);
        const consider: Vector = vu.subtract(values[i], delta);
        if (!au.isInBounds2d(data, consider)) {
          continue;
        }

        retVal.add(vu.toString(consider));
      }
    }
  }

  return retVal.size;
};

function exercise2(data: preparedData): number {
  const retVal: Set<string> = new Set<string>();

  const transmitters: Map<string, Vector[]> = getTransmitters(data);

  for (const values of transmitters.values()) {
    for (let i = 0; i < values.length; i++) {
      for (let ii = 0; ii < values.length; ii++) {
        if (ii === i)
          continue;

        const delta: Vector = vu.subtract(values[ii], values[i]);
        let consider: Vector = vu.add(values[i], delta);
        while (au.isInBounds2d(data, consider)) {
          retVal.add(vu.toString(consider));
          consider = vu.add(consider, delta);
        }
      }
    }
  }

  return retVal.size;
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));


// Exercise 1: Test Case
let answer = exercise1(test);
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 14);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 318);

// Exercise 2: Test Case
answer = exercise2(test);
console.log(`- Test 2 = '${answer}'`);
console.assert(answer === 34);

// // Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 1126);