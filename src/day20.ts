import type { Vector } from './types/vector.ts';

import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';
import * as pu from './utils/pathfinding-utils.ts';

const day = 20;

type preparedData = {
  start: Vector;
  end: Vector;
  maze: number[][];
}

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = {
    start: vu.origin,
    end: vu.origin,
    maze: []
  };
  for (let y = 0; y < data.length; y++) {
    retVal.maze[y] = [];
    for (let x = 0; x < data[y].length; x++) {
      switch (data[y][x]) {
        case '#': retVal.maze[y].push(-1); break;
        case '.': retVal.maze[y].push(0); break;
        case 'S': retVal.start = vu.create(x,y); retVal.maze[y].push(0); break;
        case 'E': retVal.end = vu.create(x,y); retVal.maze[y].push(0); break;
        default: continue;
      }
    }
  }
  return retVal;
};

function printMaze(maze: number[][]): void {
  for (const row of maze) {
    console.log(row.join('').replaceAll('0','.').replaceAll('-1','#'));
  }
}

function printMazePath(maze: number[][], path: Evaluation[]): void {
  const copy = au.clone2d(maze);
  for (let tile of path) {
    copy[tile.position.y][tile.position.x] = 1;
  }
  printMaze(copy);
}

function getShortcuts(maze: number[][], path: pu.Path, saving: number = 100): Vector[] {
  let retVal: Vector[] = [];

  for (let i = 0; i < path.length; i++) {
    for (const cardinal of vu.cardinals) {
      const consider = vu.add(path[i].position, cardinal);

      if (!au.isInBounds2d(maze, consider)) {
        continue;
      }

      if (retVal.find((node) => vu.equals(consider, node))) {
        continue;
      }

      if (maze[consider.y][consider.x] === -1) {
        const next = vu.add(consider, cardinal);

        if (!au.isInBounds2d(maze, next)) {
          continue;
        }

        if (maze[next.y][next.x] === 0) {

          for (let ii = i; ii < path.length; ii++) {
            if (vu.equals(path[ii].position, next)) {
              if (ii - i > saving) {
                retVal.push(consider);
              }
            }
          }
        }
      }
    }
  }

  return retVal;
}

function exercise1(data: preparedData): number {
  let retVal = 0
  const baseline: pu.Path = pu.frontier(data.maze, data.start, data.end, [-1]).next().value;
  retVal = getShortcuts(data.maze, baseline).length;
  return retVal;
}

function exercise2(data: preparedData): number {
  let retVal = 0;
  return retVal;
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test);
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 0);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 1429);

// Exercise 2: Test Case
// let answerStr = exercise2(test, vu.create(7,7), 12);
// console.log(`- Test 2 = '${answerStr}'`);
// console.assert(answerStr === '(6,1)');

// Exercise 2: Answer
// answerStr = exercise2(real);
// console.log(`- Exercise 2 = '${answerStr}'`);
// console.assert(answerStr === '(60,37)');