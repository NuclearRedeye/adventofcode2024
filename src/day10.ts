import type { Vector } from './types/vector.ts';
import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';

const day = 10;

type preparedData = number[][];

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];

  for (const line of data) {
    retVal.push([...line].map((n) => parseInt(n)));
  }
  return retVal;
};

const cardinals: Vector[] = [
  {x: 0, y: -1}, // North
  {x: 1, y: 0},  // East
  {x: 0, y: 1},  // South
  {x: -1, y: 0},  // West
];

function getPaths(data: preparedData, current: Vector, target: number, result: string[] | undefined = undefined): string[] {
  const found = (result) ? result : [];
  for (const direction of cardinals) {
    const consider = vu.add(current, direction);
    if (au.isInBounds2d(data, consider)) {
      if (data[current.y][current.x] + 1 === data[consider.y][consider.x]) {
        if (data[consider.y][consider.x] === target) {
          found.push(vu.toString(consider));
        } else {
          getPaths(data, consider, target, found);
        }
      }
    }
  }

  return found;
}

function exercise1(data: preparedData): number {
  let retVal = 0;
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x] === 0) {
        retVal += new Set(getPaths(data, vu.create(x, y), 9)).size;
      }
    }
  }
  return retVal;
};

function exercise2(data: preparedData): number {
  let retVal = 0;
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x] === 0) {
        retVal += getPaths(data, vu.create(x, y), 9).length;
      }
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
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 36);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 694);

// Exercise 2: Test Case
answer = exercise2(test);
console.log(`- Test 2 = '${answer}'`);
console.assert(answer === 81);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 1497);