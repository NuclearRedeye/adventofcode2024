
import type { Vector } from './types/vector.ts';
import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';

const day = 4;

type preparedData = string[][];

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];

  for (let i = 0; i < data.length; i++) {
    retVal[i] = [...data[i]];
  }
  return retVal;
};

function wordsearch(data: preparedData, start: Vector, direction: Vector, match = 'XMAS'): number {

  let current = vu.clone(start);

  for (let i = 0; i < match.length; i++) {
    
    if (current.y < 0 || current.y >= data.length) {
      break;
    }

    if (current.x < 0 || current.x >= data[current.y].length) {
      break;
    }

    if (data[current.y][current.x] !== match[i]) {
      break;
    }

    if (i + 1 === match.length) {
      return 1;
    }

    current = vu.add(current, direction);
  }
  
  return 0;
}

function exercise1(data: preparedData): number {
  let retVal = 0;

  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const start = vu.create(x, y);

      retVal += wordsearch(data, start, vu.create(1, 0), 'XMAS'); // Left
      retVal += wordsearch(data, start, vu.create(1, 1), 'XMAS'); // Left + Down
      retVal += wordsearch(data, start, vu.create(0, 1), 'XMAS'); // Down
      retVal += wordsearch(data, start, vu.create(-1, 1), 'XMAS'); // Right + Down
      retVal += wordsearch(data, start, vu.create(-1, 0), 'XMAS'); // Right
      retVal += wordsearch(data, start, vu.create(-1, -1), 'XMAS'); // Right + Up
      retVal += wordsearch(data, start, vu.create(0, -1), 'XMAS'); // Up
      retVal += wordsearch(data, start, vu.create(1, -1), 'XMAS'); // Up + Left
    }
  }

  return retVal;
};

function exercise2(data: preparedData): number {
  let retVal = 0;

  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x] === 'A') {
        let isMas = 0;
        isMas += wordsearch(data, vu.create(x - 1, y - 1), vu.create(1, 1), 'MAS'); // Top Left to Bottom Right
        isMas += wordsearch(data, vu.create(x + 1, y + 1), vu.create(-1, -1), 'MAS'); // Bottom Right to Top Left

        isMas += wordsearch(data, vu.create(x + 1, y - 1), vu.create(-1, 1), 'MAS'); // Top Right to Bottom Left
        isMas += wordsearch(data, vu.create(x - 1, y + 1), vu.create(1, -1), 'MAS'); // Bottom Left to Top Right

        if (isMas === 2) {
          retVal += 1;
        }
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
console.assert(answer === 18);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 2603);

// Exercise 2: Test Case
answer = exercise2(test);
console.assert(answer === 9);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 1965);