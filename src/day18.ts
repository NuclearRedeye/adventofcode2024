import type { Vector } from './types/vector.ts';

import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';

const day = 18;

type preparedData = Vector[]

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];
  for (const line of data) {
    const [x, y] = line.split(',');
    retVal.push(vu.create(parseInt(x),parseInt(y)));
  }
  return retVal;
};

type Evaluation = {
  position: Vector;
  direction: Vector;
  parent: Evaluation | undefined;
}

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

function generateMaze(data: preparedData, extents: Vector, ticks: number): number[][] {
  const retVal: number[][] = [];
  for (let y = 0; y < extents.y; y++) {
    retVal.push(new Array(extents.x).fill(0));
  }

  for (let i = 0; i < ticks; i++) {
    if (i < ticks && au.isInBounds2d(retVal, data[i])) {
      retVal[data[i].y][data[i].x] = -1;
    }
  }

  return retVal;
}

function solve(maze: number[][], start: Vector, end: Vector): number {
  let retVal = 0;

  const openList: Evaluation[] = [{
    position: start,
    direction: vu.create(1, 0),
    parent: undefined
  }];

  const closedList: Evaluation[] = [];

  do {
    let currentNode = openList.shift() as Evaluation;

    // Have we reached the end?
    if (vu.equals(currentNode.position, end)) {
      let path: Evaluation[] = [];
      let current = currentNode;
      while (current) {
        path.push(current);
        current = current.parent as Evaluation;
      }
      retVal = (retVal > 0) ? Math.min(retVal, path.length - 1) : path.length - 1;
      // console.log(`Route: current best is ${retVal}`);
      // printMazePath(maze, path);
    }

    // Queue all valid moves from this position in the maze...
    for (const cardinal of vu.cardinals) {

      const next: Evaluation = {
        position: vu.add(currentNode.position, cardinal),
        direction: cardinal,
        parent: currentNode
      }

      // Bounds Check
      if (!au.isInBounds2d(maze, next.position)) {
        continue;
      }

      // Is it Wall?
      if (maze[next.position.y][next.position.x] === -1) {
        continue;
      }

      // Have we been there before?
      if (closedList.find((node) => vu.equals(next.position, node.position) && vu.equals(next.direction, node.direction))) {
        continue;
      }

      // Is this node already on the queue?
      const openListNode = openList.find((node) => vu.equals(next.position, node.position) && vu.equals(next.direction, node.direction));
      if (openListNode) {
        continue;
      }

      // Add to the queue
      openList.push(next);
    }

    // Update the closed list
    closedList.push(currentNode);

  } while (openList.length > 0);

  return retVal;
}

function exercise1(data: preparedData, extents: Vector = vu.create(71,71), ticks: number = 1024): number {
  const maze = generateMaze(data, extents, ticks);
  return solve(maze, vu.create(0,0), vu.create(extents.x - 1, extents.y - 1));
}

function exercise2(data: preparedData, extents: Vector = vu.create(71,71), start: number = 1024): string {
  let retVal = vu.create(0,0);
  for (let i = data.length - 1; i > start; i--) {
    const maze = generateMaze(data, extents, i);
    const solved = solve(maze, vu.create(0,0), vu.create(extents.x - 1, extents.y - 1));
    if (solved > 0) {
      retVal = data[i];
      break;
    }
  }
  return vu.toString(retVal);
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test, vu.create(7,7), 12);
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 22);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 276);

// Exercise 2: Test Case
let answerStr = exercise2(test, vu.create(7,7), 12);
console.log(`- Test 2 = '${answerStr}'`);
console.assert(answerStr === '(6,1)');

// Exercise 2: Answer
answerStr = exercise2(real);
console.log(`- Exercise 2 = '${answerStr}'`);
console.assert(answerStr === '(60,37)');