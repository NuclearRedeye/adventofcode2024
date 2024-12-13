import type { Vector } from './types/vector.ts';

import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';

const day = 13;

type Bandit = {
  a: Vector;
  b: Vector;
  prize: Vector;
}

type preparedData = Bandit[]

const reButtonA = new RegExp(/^Button A: X\+(\d+), Y\+(\d+)$/);
const reButtonB = new RegExp(/^Button B: X\+(\d+), Y\+(\d+)$/);
const rePrize = new RegExp(/^Prize: X=(\d+), Y=(\d+)$/);

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];

  for (let i = 0; i < data.length; i+=4) {
    const matchA = data[i].match(reButtonA);
    const matchB = data[i + 1].match(reButtonB);
    const matchPrize = data[i + 2].match(rePrize);

    if (matchA && matchB && matchPrize) {
      const bandit: Bandit = {
        a: vu.create(parseInt(matchA[1]), parseInt(matchA[2])),
        b: vu.create(parseInt(matchB[1]), parseInt(matchB[2])),
        prize: vu.create(parseInt(matchPrize[1]), parseInt(matchPrize[2]))
      };

      retVal.push(bandit);
    }
  }

  return retVal;
};

function playBandit(bandit: Bandit, limit: number = 100): number {
  let score = -1;
  for (let a = 0; a < limit; a++) {
    for (let b = 0; b < limit; b++) {
      if (bandit.a.x * a + bandit.b.x * b === bandit.prize.x && bandit.a.y * a + bandit.b.y * b === bandit.prize.y) {
        score = (score < 0 || score > a * 3 + b) ?  a * 3 + b : score;
      }
    }
  }
  return (score < 0) ? 0 : score;
}

function exercise1(data: preparedData): number {
  let retVal = 0;
  for (const bandit of data) {
    retVal += playBandit(bandit, 100);
  }
  return retVal;
};

function exercise2(data: preparedData): number {
  let retVal = 0;
  for (const bandit of data) {
    const calibrated = {
      ...bandit,
      prize: {
        x: (10000000000000 + bandit.prize.x),
        y: (10000000000000 + bandit.prize.y),
      }
    }
    retVal += playBandit(calibrated, 100);
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
console.assert(answer === 480);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 31552);

// Exercise 2: Test Case
// answer = exercise2(test);
// console.log(`- Test 2 = '${answer}'`);
// console.assert(answer === 11387);

// Exercise 2: Answer
// answer = exercise2(real);
// console.log(`- Exercise 2 = '${answer}'`);
// console.assert(answer === 271691107779347);