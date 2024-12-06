import { readFile } from './utils.ts';

const day = 2;

const re = new RegExp(/(\d+)/g);

type preparedData = number[][];

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];

  for (let i = 0; i < data.length; i++) {
    const match = data[i].matchAll(re);
    if (match) {
      retVal[i] = [];
      for (const value of match) {
        retVal[i].push(parseInt(value[0]));
      }
    }
  }
  return retVal;
};


function isSafeAsc(data: number[], tolerance: number = 0): boolean {
  let errors = 0;
  for (let a = 0, b = 1; b < data.length; a++, b++) {
    if (data[b] < data[a] || data[b] - data[a] <= 0 || data[b] - data[a] > 3) {
      errors += 1;
      if (errors > tolerance) {
        return false;
      }
      return isSafeAsc(data.toSpliced(a, 1), tolerance - 1) || isSafeAsc(data.toSpliced(b, 1), tolerance - 1);
    }
  }
  return true;
}

function isSafeDes(data: number[], tolerance: number = 0): boolean {
  let errors = 0;
  for (let a = 0, b = 1; b < data.length; a++, b++) {
    if (data[b] > data[a] || data[a] - data[b] <= 0 || data[a] - data[b] > 3) {
      errors += 1;
      if (errors > tolerance) {
        return false;
      }
      return isSafeDes(data.toSpliced(a, 1), tolerance - 1) || isSafeDes(data.toSpliced(b, 1), tolerance - 1);
    }
  }
  return true;
}

function exercise1(data: preparedData): number {
  let retVal = 0;

  for (const report of data) {
    if (isSafeAsc(report) || isSafeDes(report)) {
      retVal += 1;
    }
  }

  return retVal;
};

function exercise2(data: preparedData): number {
  let retVal = 0;

  for (const report of data) {
    if (isSafeAsc(report, 1) || isSafeDes(report, 1)) {
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
console.assert(answer === 2);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 591);

// Exercise 2: Test Case
answer = exercise2(test);
console.assert(answer === 4);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 621);