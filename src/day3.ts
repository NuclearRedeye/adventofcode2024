import { readFile } from './utils.ts';

const day = 3;

const re = new RegExp(/mul\((\d{1,3}),(\d{1,3})\)/g);

function exercise1(data: string[]): number {
  let retVal: number = 0;

  for (const line of data){
    const match = line.matchAll(re);
    if (match) {
      for (const value of match) {
        retVal += parseInt(value[1]) * parseInt(value[2]);
      }
    }
  }
  return retVal;
};

const re2 = new RegExp(/mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\)/g);

function exercise2(data: string[]): number {
  let retVal: number = 0;

  let mulEnabled = true;
  for (const line of data){
    const match = line.matchAll(re2);
    if (match) {
      for (const value of match) {
        if (value[0] === "don't()") {
          mulEnabled = false;
          continue;
        } 
        
        if (value[0] === "do()") {
          mulEnabled = true;
          continue;
        }

        if (mulEnabled) {
          retVal += parseInt(value[1]) * parseInt(value[2]);
        }
      }
    }
  }
  return retVal;
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = await readFile(`./data/day${day}/sample.txt`);
const test2 = await readFile(`./data/day${day}/sample2.txt`);
const real = await readFile(`./data/day${day}/data.txt`);

// Exercise 1: Test Case
let answer = exercise1(test);
console.assert(answer === 161);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);

// Exercise 2: Test Case
answer = exercise2(test2);
console.assert(answer === 48);

// Exercise 1: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);