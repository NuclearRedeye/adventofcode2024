import { readFile } from './utils/file-utils.ts';

const day = 11;

type preparedData = bigint[];

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];
    for (const number of data[0].split(' ')) {
      retVal.push(BigInt(number));
    }
  return retVal;
};

const cache = new Map<string, number>();

function blink(value: bigint, depth: number): number {

  if (cache.has(`(${value},${depth})`)) {
    return cache.get(`(${value},${depth})`) as number;
  }

  let retVal = 0;
  const numberStr = value.toString();

  if (depth === 0) {
    retVal = 1;
  }
  else if (value === 0n) {
    retVal = blink(1n, depth - 1);
  }
  else if (!(numberStr.length & 0x1)) {
    const left = BigInt(numberStr.substring(0, numberStr.length / 2));
    const right = BigInt(numberStr.substring(numberStr.length / 2));
    retVal = blink(left, depth - 1) + blink(right, depth - 1);
  }
  else {
    retVal = blink(value * 2024n, depth - 1);
  }

  cache.set(`(${value},${depth})`, retVal);
  return retVal;
}

function exercise1(data: preparedData): number {
  let retVal = 0;
  for (const number of data) {
    retVal += blink(number, 25);
  }
  return retVal;
};

function exercise2(data: preparedData): number {
  let retVal = 0;
  for (const number of data) {
    retVal += blink(number, 75);
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
console.assert(answer === 55312);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 203609);

// Exercise 2: Test Case
answer = exercise2(test);
console.log(`- Test 2 = '${answer}'`);
console.assert(answer === 65601038650482);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 240954878211138);