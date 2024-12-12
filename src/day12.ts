import type { Vector } from './types/vector.ts';
import { readFile } from './utils/file-utils.ts';

import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';
import { LargeNumberLike } from 'crypto';


const day = 12;

type Plot = {
  value: string;
  region: number;
  perimeters: number;
  corners: number;
}

type preparedData = Plot[][];

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];
  for (let y = 0; y < data.length; y++) {
    retVal[y] = [];
    for (const value of [...data[y]]) {
      retVal[y].push({
        value,
        region: 0,
        perimeters: 0,
        corners: 0
      });
    }
  }
  return retVal;
};

const cardinals: Vector[] = [
  {x: 0, y: -1}, // North
  {x: 1, y: 0},  // East
  {x: 0, y: 1},  // South
  {x: -1, y: 0},  // West
];

type Region = {
  area: Set<string>;
  perimeters: number;
  corners: number;
}

function analyseRegion(data: preparedData, start: Vector, regionId: number): number {
  let retVal: Region = {
    area: new Set<string>(),
    perimeters: 0,
    corners: 0
  };

  let assess: Vector[] = [start];

  do
  {
    const current: Vector = assess.pop() as Vector;
    if (au.isInBounds2d(data, current)) {
      const subject = data[current.y][current.x];
      if (subject.region === 0) {
        if (subject.value === data[start.y][start.x].value) {
          // Add to Region
          subject.region = regionId;
          subject.perimeters = 4;
          subject.corners = 0;

          retVal.area.add(vu.toString(current));

          // Check Neighbours
          for (const consider of cardinals.map((v) => vu.add(current, v))) {
            if (au.isInBounds2d(data, consider)) {

              // Add unvisited to queue
              if (subject.value === data[consider.y][consider.x].value && data[consider.y][consider.x].region === 0) {
                assess.push(consider);
              }

              // Calculate Perimeters 
              if (subject.value === data[consider.y][consider.x].value) {
                subject.perimeters -= 1;
              }
            }
          }

          // Count Corners
          for (const consider of cardinals.map((v) => vu.add(current, v))) {
            
          }

          retVal.perimeters += subject.perimeters;
        }
      }
    }
  } while (assess.length > 0);

  console.log(`Region ${data[start.y][start.x].value} with price ${retVal.area.size} * ${retVal.perimeters} = ${retVal.area.size * retVal.perimeters}`);
  return retVal.area.size * retVal.perimeters;
}

function exercise1(data: preparedData): number {
  let retVal = 0;
  let regionId = 1;
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x].region === 0) {
        retVal += analyseRegion(data, {x, y}, regionId++);
      }
    }
  }
  return retVal;
};

function exercise2(data: preparedData): number {
  let retVal = 0;
  return retVal;
};


console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test);
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 1930);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 1522850);

// Exercise 2: Test Case
answer = exercise2(test);
console.log(`- Test 2 = '${answer}'`);
console.assert(answer === 1206);

// Exercise 2: Answer
// answer = exercise2(real);
// console.log(`- Exercise 2 = '${answer}'`);
// console.assert(answer === 240954878211138);



// 1x 4y = 4
// 2x 2y = 4
// 2x 3y = 8
// 5x 5y = 12