import { readFile } from './utils.ts';

const day = 4;

type preparedData = string[][];

type Vector = {
  x: number;
  y: number;
}

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];

  for (let i = 0; i < data.length; i++) {
    retVal[i] = [...data[i]];
  }
  return retVal;
};

function wordsearch(data: preparedData, start: Vector, direction: Vector, match = 'XMAS'): number {

  let current = {...start};

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

    current.x += direction.x;
    current.y += direction.y;
  }
  
  return 0;
}

function exercise1(data: preparedData): number {
  let retVal = 0;

  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const start = {
        x,
        y
      }

      retVal += wordsearch(data, start, {x:1, y:0}, 'XMAS'); // Left
      retVal += wordsearch(data, start, {x:1, y:1}, 'XMAS'); // Left + Down
      retVal += wordsearch(data, start, {x:0, y:1}, 'XMAS'); // Down
      retVal += wordsearch(data, start, {x:-1, y:1}, 'XMAS'); // Right + Down
      retVal += wordsearch(data, start, {x:-1, y:0}, 'XMAS'); // Right
      retVal += wordsearch(data, start, {x:-1, y:-1}, 'XMAS'); // Right + Up
      retVal += wordsearch(data, start, {x:0, y:-1}, 'XMAS'); // Up
      retVal += wordsearch(data, start, {x:1, y:-1}, 'XMAS'); // Up + Left
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
        isMas += wordsearch(data, {x: x - 1, y: y - 1}, {x: 1, y: 1}, 'MAS'); // Top Left to Bottom Right
        isMas += wordsearch(data, {x: x + 1, y: y + 1}, {x: -1, y: -1}, 'MAS'); // Bottom Right to Top Left

        isMas += wordsearch(data, {x: x + 1, y: y - 1}, {x: -1, y: 1}, 'MAS'); // Top Right to Bottom Left
        isMas += wordsearch(data, {x: x - 1, y: y + 1}, {x: 1, y: -1}, 'MAS'); // Bottom Left to Top Right

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

// Exercise 2: Test Case
answer = exercise2(test);

console.assert(answer === 9);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);