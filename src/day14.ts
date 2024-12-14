import type { Vector } from './types/vector.ts';
import type { Rectangle } from './types/rectangle.ts';

import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';

const day = 14;

type Robot = {
  position: Vector;
  direction: Vector;
}

type preparedData = Robot[];

const re = new RegExp(/^p\=(\d+),(\d+) v\=(-?\d+),(-?\d+)$/);

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];

  for (let i = 0; i < data.length; i++) {
    const match = data[i].match(re);
    if (match) {
      const robot: Robot = {
        position: vu.create(parseInt(match[1]), parseInt(match[2])),
        direction: vu.create(parseInt(match[3]), parseInt(match[4])),
      };

      retVal.push(robot);
    }
  }
  return retVal;
};

function move(robot: Robot, boundary: Vector, iterations = 1): Vector {
  let retVal = vu.clone(robot.position);
  for (let i = 0; i < iterations; i++) {
    const stepY = (robot.direction.y > 0) ? 1 : -1;
    for (let y = 0; y < Math.abs(robot.direction.y); y++) {
      retVal.y += stepY;
      if (retVal.y < 0) {
        retVal.y = boundary.y - 1;
      }
      if (retVal.y >= boundary.y) {
        retVal.y = 0;
      }
    }

    const stepX = (robot.direction.x > 0) ? 1 : -1;
    for (let x = 0; x < Math.abs(robot.direction.x); x++) {
      retVal.x += stepX;
      if (retVal.x < 0) {
        retVal.x = boundary.x - 1;
      }
      if (retVal.x >= boundary.x) {
        retVal.x = 0;
      }
    }
  }
  return retVal;
}

function sumRegion(robots: Robot[], region: Rectangle): number {
  let retVal = 0;
  for (const robot of robots) {
    if (robot.position.x >= region.x && robot.position.x <= region.x + region.width && robot.position.y >= region.y && robot.position.y <= region.y + region.height) {
      retVal += 1;
    }
  }
  return retVal;
}

function createGrid(robots: Robot[], size: Vector): number[][] {
  const retVal: number[][] = [];
  for (let y = 0; y < size.y; y++) {
    retVal.push(new Array(size.x).fill(0));
  }

  for (const robot of robots) {
    retVal[robot.position.y][robot.position.x] += 1;
  }

  return retVal;
}

function getContinuityScore(grid: number[][]): number {
  let retVal = 0;
  let current = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[x].length; x++) {
      if (grid[y][x] > 0) {
        current += 1;
      } else {
        retVal = Math.max(current, retVal);
        current = 0;
      }
    }
    current = 0;
  }
  return retVal;
}

function printGrid(grid: number[][]): void {
  for (const row of grid) {
    console.log(row.join('').replaceAll('0',' '));
  }
}

function exercise1(data: preparedData, boundary: Vector = {x: 101, y: 103}): number {
  let retVal = 1;
  const final: preparedData = au.clone(data);
  for (const robot of final) {
     const newPosition = move(robot, boundary, 100);
     robot.position = newPosition;
  }

  const width = Math.floor(boundary.x / 2) - 1;
  const height = Math.floor(boundary.y / 2) - 1;
  const regions: Rectangle[] = [
    {x: 0, y: 0, width, height},                  // Top Left
    {x: width + 2, y: 0, width, height},          // Top Right
    {x: 0, y: height + 2, width, height},         // Bottom Left
    {x: width + 2, y: height + 2, width, height}, // Bottom Right
  ]

  for (const region of regions) {
    retVal *= sumRegion(final, region);
  }

  return retVal;
};

function exercise2(data: preparedData, boundary: Vector = {x: 101, y: 103}): number {
  let retVal = 0;
  const final: preparedData = au.clone(data);
  for (let i = 0; i < 10000; i++) {
    for (const robot of final) {
      robot.position = move(robot, boundary);
    }

    const grid = createGrid(final, boundary);
    if (getContinuityScore(grid) >= 10) {
      console.log(`Iteration ${i}`)
      printGrid(grid);
      retVal = i + 1;
      break;
    }
  }
  return retVal;
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test, {x: 11, y: 7});
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 12);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 219512160);

// Exercise 2: Test Case
// answer = exercise2(test);
// console.log(`- Test 2 = '${answer}'`);
// console.assert(answer === 480);

// Exercise 2: Answer
answer = await exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 6398);