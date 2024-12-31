import { readFile } from './utils/file-utils.ts';

const day = 22;

type preparedData = bigint[];

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];
  for (const line of data) {
    retVal.push(BigInt(line));
  }
  return retVal;
};

function getNextSecret(secret: bigint): bigint {
  let retVal: bigint = 0n;
  retVal = ((secret * 64n) ^ secret) % 16777216n;
  retVal = ((retVal / 32n) ^ retVal) % 16777216n;
  retVal = ((retVal * 2048n) ^ retVal) % 16777216n;
  return retVal;
}

function exercise1(data: preparedData): bigint {
  let retVal: bigint = 0n;
  for (const value of data) {
    let secret: bigint = value;
    for (let i = 0; i < 2000; i++) {
      secret = getNextSecret(secret);
    }
    retVal += secret;
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
let answer: bigint = exercise1(test);
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 37327623n);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 15608699004n);

// // Exercise 2: Test Case
// answer = exercise2(test);
// console.log(`- Test 2 = '${answer}'`);
// console.assert(answer === 0);

// // Exercise 2: Answer
// answer = exercise2(real);
// console.log(`- Exercise 2 = '${answer}'`);
// console.assert(answer === 0);
