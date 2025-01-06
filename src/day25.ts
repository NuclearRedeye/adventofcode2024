import { readFile } from './utils/file-utils.ts';

const day = 25;

type preparedData = {
  locks: number[][];
  keys: number[][];
}

function parseLock(data: string[]): number[] {
  let retVal = new Array(data[0].length).fill(0);
  for (let x = 0; x < data[0].length; x++) {
    for (let y = 1; y < data.length - 1; y++) {
      if (data[y][x] === '#') {
        retVal[x] += 1;
      } else {
        break;
      }
    }
  }
  return retVal;
}

function parseKey(data: string[]): number[] {
  let retVal = new Array(data[0].length).fill(0);
  for (let x = 0; x < data[0].length; x++) {
    for (let y = data.length - 2; y >= 0; y--) {
      if (data[y][x] === '#') {
        retVal[x] += 1;
      } else {
        break;
      }
    }
  }
  return retVal;
}

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = {
    locks: [],
    keys: []
  };

  let block: string[] = [];
  for (const line of data) {
    if (line.length === 0) {
      if (block.length > 0) {
        if (block[0][0] === '#') {
          retVal.locks.push(parseLock(block));
        }
        else if (block[0][0] === '.') {
          retVal.keys.push(parseKey(block));
        }
      }
      block = [];
      continue;
    }

    block.push(line);
  }
  return retVal;
};

function exercise1(data: preparedData): number {
  let retVal: number = 0;
  for (const lock of data.locks) {
    for (const key of data.keys) {
      if (lock.length !== key.length) {
        continue;
      }
      let fit: boolean = true;
      for (let i = 0; i < lock.length && fit === true; i++) {
        fit = ((lock[i] + key[i]) <= 5);
      }

      if (fit) {
        retVal += 1;
      }
    }
  }
  return retVal;
}

function exercise2(data: preparedData): number {
  let retVal = 0
  return retVal;
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer: number = exercise1(test);
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 3);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 3320);

// // Exercise 2: Test Case
// answer = exercise2(test);
// console.log(`- Test 2 = '${answer}'`);
// console.assert(answer === 0);

// // Exercise 2: Answer
// answer = exercise2(real);
// console.log(`- Exercise 2 = '${answer}'`);
// console.assert(answer === 0);
