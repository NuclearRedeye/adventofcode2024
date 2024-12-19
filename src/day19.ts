import { readFile } from './utils/file-utils.ts';

const day = 19;

type preparedData = {
  patterns: string[];
  displays: string[];
}

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = {
    patterns: [],
    displays: []
  };

  for (const line of data) {
    if (line.length === 0) {
      continue;
    }

    if (line.includes(',')){
      for (const pattern of line.split(',')) {
        retVal.patterns.push(pattern.trim());
      }
      continue;
    }

    retVal.displays.push(line.trim());
  }

  retVal.patterns.sort((a, b) => b.length - a.length);
  return retVal;
};

const cache: Map<string, number> = new Map<string, number>();
function canCreateDisplay(target: string, words: string[]): number {
  let retVal = 0;

  if (!target) {
    return 1;
  }

  if (cache.has(target)) {
    return cache.get(target) as number;
  }
      
  for (const word of words) {
    if (target.startsWith(word)) {
      retVal += canCreateDisplay(target.substring(word.length), words);
    }
  }

  cache.set(target, retVal);

  return retVal;
}

function exercise1(data: preparedData): number {
  let retVal = 0;
  for (const display of data.displays) {
    if (canCreateDisplay(display, data.patterns)) {
      retVal += 1;
    };
    cache.clear();
  }
  return retVal;
}

function exercise2(data: preparedData): number {
  let retVal = 0;
  for (const display of data.displays) {
    retVal += canCreateDisplay(display, data.patterns);
    cache.clear();
  }
  return retVal;
}

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test);
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 6);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 260);

// Exercise 2: Test Case
answer = exercise2(test);
console.log(`- Test 2 = '${answer}'`);
console.assert(answer === 16);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 639963796864990);