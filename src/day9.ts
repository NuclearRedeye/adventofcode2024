import { readFile } from './utils/file-utils.ts';

const day = 9;

type Block  = {
  bid: number;
  fid: number;
  size: number;
}

type preparedData = Block[];

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];

  for (const line of data) {
    let fid = 0;
    let bid = 0;
    for (let i = 0; i < line.length; i++) {
      const isFreeSpace = (i & 0x1);
      const value = parseInt(line[i]);
      for (let x = 0; x < value; x++) {
        retVal.push({
          bid: bid++,
          fid: isFreeSpace ? -1 : fid,
          size: value
        });
      }
      if (isFreeSpace) {
        fid++;
      }
    }
  }

  return retVal;
};


function copyArray(data: preparedData): preparedData {
  const retVal: preparedData = new Array(data.length);
  for (let i = 0; i < data.length; i++) {
    retVal[i] = {...data[i]};
  } 
  return retVal;
}

function exercise1(data: preparedData): number {
  const compacted = copyArray(data);

  let last = compacted.length - 1;
  for (let i = 0; i < compacted.length; i++) {
    if (compacted[i].fid === -1) {
      for (let ii = last; ii >= i; ii--) {
        if (compacted[ii].fid !== -1) {
          compacted[i].fid = compacted[ii].fid;
          compacted[ii].fid = -1;
          last = ii;
          break;
        }
      }
    }
  }

  for (let i = compacted.length - 1; i >= 0; i--) {
    if (compacted[i].fid >= 0) {
      break;
    }
    compacted[i].fid = 0;
  }

  return compacted.reduce((sum, current) => sum + (current.bid * current.fid), 0);
};

function exercise2(data: preparedData): number {
  const compacted = copyArray(data);

  for (let end = compacted.length - 1; end >= 0; end--) {
    if (compacted[end].fid !== -1) {
      for (let free = 0; free < end; free++) {
        if (compacted[free].fid === -1 && compacted[free].size >= compacted[end].size) {
          const file = {...compacted[end]};
          const target = {...compacted[free]};

          // Reduce size of free space
          for (let i = 0; i < target.size; i++) {
            compacted[free + i].size = target.size - file.size;
          }

          // Copy File
          for (let i = 0; i < file.size; i++) {
            compacted[free + i].fid = file.fid;
            compacted[free + i].size = file.size;
          }

          // Delete Original
          for (let i = 0; i < file.size; i++) {
            compacted[end - i].fid = -1;
          }

          break;
        }
      }
    }
  }

  for (let i = 0; i < compacted.length; i++) {
    if (compacted[i].fid >= 0) {
      break;
    }
    compacted[i].fid = 0;
  }

  let result = 0;
  for (let i = 0; i < compacted.length; i++) {
    if (compacted[i].fid !== -1) {
      result += (compacted[i].bid * compacted[i].fid)
    }
  }

  return result;
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test);
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 1928);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 6201130364722);

// Exercise 2: Test Case
answer = exercise2(test);
console.log(`- Test 2 = '${answer}'`);
console.assert(answer === 2858);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 6221662795602);