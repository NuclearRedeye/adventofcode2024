import type { Vector } from './types/vector.ts';
import type { Rectangle } from './types/rectangle.ts';

import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';
import { rejects } from 'assert';

const day = 15;

type preparedData = {
  robot: Vector;
  warehouse: number[][];
  moves: Vector[];
}

const re = new RegExp(/^p\=(\d+),(\d+) v\=(-?\d+),(-?\d+)$/);

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = {
    robot: vu.create(0, 0),
    warehouse: [],
    moves: []
  };

  for (let y = 0; y < data.length; y++) {
    if (data[y].length === 0) {
      continue;
    }
    else if (data[y][0] === '#') {
      retVal.warehouse[y] = [];
      for (let x = 0; x < data[y].length; x++) {
        switch (data[y][x]) {
          case '#': retVal.warehouse[y].push(-1); break;
          case '.': retVal.warehouse[y].push(0); break;
          case 'O': retVal.warehouse[y].push(1); break;
          case '@': retVal.robot = vu.create(x,y); retVal.warehouse[y].push(0); break;
          default: continue;
        }
      }
    } else {
      for (let c = 0; c < data[y].length; c++) {
        switch (data[y][c]) {
          case '<': retVal.moves.push(vu.create(-1, 0)); break;
          case '>': retVal.moves.push(vu.create(1, 0)); break;
          case '^': retVal.moves.push(vu.create(0, -1)); break;
          case 'v': retVal.moves.push(vu.create(0, 1)); break;
          default: continue;
        }
      }
    }
  }
  return retVal;
};

function printWarehouse(warehouse: number[][], robot: Vector) {
  for (let y = 0; y < warehouse.length; y++) {
    const line: string[] = [];
    for (let x = 0; x < warehouse[y].length; x++) {
      if (vu.equals(robot, vu.create(x, y))) {
        line.push('@');
      }
      else {
        switch (warehouse[y][x]) {
          case -1: line.push('#'); break;
          case 0:  line.push('.'); break;
          case 1:  line.push('0'); break;
          default: break;
        }
      }
    }
    console.log(line.join(''));
  }
}

function push(warehouse: number[][], target: Vector, direction: Vector): number[][] {
  let retVal = au.clone2d(warehouse);
  let list: Vector[] = [];
  let next = target
  do {
    list.push(next);
    next = vu.add(next, direction);
  } while (retVal[next.y][next.x] > 0);

  if (retVal[next.y][next.x] === 0) {
    retVal[next.y][next.x] = 1;
    for (let i = 0; i < list.length; i++) {
      retVal[list[i].y][list[i].x] = 1;
    }
    retVal[target.y][target.x] = 0;
  }
  return retVal;
}

function exercise1(data: preparedData): number {
  let retVal = 0;
  let robot = vu.clone(data.robot);
  let warehouse = au.clone2d(data.warehouse);
  for (const move of data.moves) {
    const next = vu.add(robot, move);
    if (au.isInBounds2d(warehouse, next)) {
      switch (warehouse[next.y][next.x]){
        case -1: break;
        case 0: robot = next; break;
        default:
          warehouse = push(warehouse, next, move);
          if (warehouse[next.y][next.x] === 0) {
            robot = next;
          }
          break;
      }
    }
  }

  for (let y = 0; y < warehouse.length; y++) {
    for (let x = 0; x < warehouse[y].length; x++) {
      if (warehouse[y][x] > 0) {
        retVal += (100 * y) + x;
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
console.assert(answer === 10092);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 1415498);

// Exercise 2: Test Case
// answer = exercise2(test);
// console.log(`- Test 2 = '${answer}'`);
// console.assert(answer === 480);

// Exercise 2: Answer
// answer = await exercise2(real);
// console.log(`- Exercise 2 = '${answer}'`);
// console.assert(answer === 6398);