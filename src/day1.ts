import { readFile } from './utils.ts';

const day = 1;

const re = new RegExp(/^(\d+)\s+(\d+)$/);


interface preparedData {
  a: number[];
  b: number[];
}

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = {
    a: [],
    b: []
  }

  for (const line of data){
    const match = line.match(re);
    if (match) {
      retVal.a.push(parseInt(match[1]));
      retVal.b.push(parseInt(match[2]));
    }
  }

  return retVal;
};

function exercise1(data: preparedData): number {
  const a_sorted = data.a.toSorted((a, b) => a - b);
  const b_sorted = data.b.toSorted((a, b) => a - b);
  const deltas: number[] = [];

  for (let i = 0; i < a_sorted.length && i < b_sorted.length; i++){
    const delta =Math.abs(a_sorted[i] - b_sorted[i]);
    //console.log(`delta between ${a_sorted[i]} and ${b_sorted[i]} is ${delta}`);
    deltas.push(delta);
  }

  return deltas.reduce((acc, current) => acc + current);
};

function exercise2(data: preparedData): number {
  const factors = new Map<number, number>();
  for (const value of data.b) {
    if (factors.has(value)){
      const prev = factors.get(value);
      if (prev) {
        factors.set(value, prev + 1);
      }
      continue;
    }
    factors.set(value, 1);
  }

  const scaled: number[] = [];
  for (const value of data.a) {
    const multipler = factors.get(value) || 0;
    console.log(`scaling ${value} by ${multipler} is ${value * multipler}`);
    scaled.push(value * multipler);
  }

  return scaled.reduce((acc, current) => acc + current);
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}.test.txt`));
const real = prepareData(await readFile(`./data/day${day}.data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test);
console.assert(answer === 11);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);

// Exercise 2: Test Case
answer = exercise2(test);
console.assert(answer === 31);

// Exercise 1: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);