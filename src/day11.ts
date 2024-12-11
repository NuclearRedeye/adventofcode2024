import type { Node } from './utils/list-utils.ts';
import { readFile } from './utils/file-utils.ts';
import * as lu from './utils/list-utils.ts';

const day = 11;

type preparedData = bigint[];

function prepareData(data: string[]): preparedData {
  let retVal: bigint[] = [];
  for (const number of data[0].split(' ')) {
    retVal.push(BigInt(number))
  }
  return retVal;
};

function blink(data: Node<bigint>): void {
  let current: Node<bigint> | undefined = data;
  do
  {
    if (current.value === 0n) {
      current.value = 1n;
      current = current.next;
      continue;
    }

    const numberStr = current.value.toString()
    if (!(numberStr.length & 0x1)) {
      const next = current.next;
      current.value = BigInt(numberStr.substring(0, numberStr.length / 2));
      lu.insert(lu.create(BigInt(numberStr.substring(numberStr.length / 2)), current.next), current);
      current = next;
      continue
    }

    current.value = BigInt(current.value) * 2024n;
    current = current.next;
    
  } while (current !== undefined)
}

function exercise1(data: preparedData): number {
  const start = lu.fromArray(data);
  for (let i = 0; i < 25; i++) {
    console.log(`Step: ${i}...`);
    blink(start);
  }
  return lu.size(start);
};

function exercise2(data: preparedData): number {
  let retVal = 0;
  for (const value of data) {
    const start = lu.create(value);
    for (let i = 0; i < 75; i++) {
      console.log(`Step: ${i}...`);
      blink(start);
    }
    retVal += lu.size(start);
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
//answer = exercise2(test);
//console.log(`- Test 2 = '${answer}'`);
//console.assert(answer === 55312);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 1497);