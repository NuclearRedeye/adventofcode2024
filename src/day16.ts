import type { Vector } from './types/vector.ts';

import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';

const day = 16;

type Entity = {
  position: Vector;
  direction: Vector;
  score: number;
}

type preparedData = {
  start: Vector;
  end: Vector;
  maze: number[][];
}

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = {
    start: vu.create(0, 0),
    end: vu.create(0, 0),
    maze: []
  };

  for (let y = 0; y < data.length; y++) {
    retVal.maze[y] = [];
    for (let x = 0; x < data[y].length; x++) {
      switch (data[y][x]) {
        case '#': retVal.maze[y].push(-1); break;
        case '.': retVal.maze[y].push(0); break;
        case 'S': retVal.maze[y].push(0); retVal.start = vu.create(x,y); break;
        case 'E': retVal.maze[y].push(0); retVal.end = vu.create(x,y); break;
        default: continue;
      }
    }
  }
  return retVal;
};

function printMaze(maze: number[][], entity: Entity) {
  for (let y = 0; y < maze.length; y++) {
    const line: string[] = [];
    for (let x = 0; x < maze[y].length; x++) {
      if (vu.equals(entity.position, vu.create(x, y))) {
        if (entity.direction.x === 1) line.push('>');
        if (entity.direction.x === -1) line.push('<');
        if (entity.direction.y === 1) line.push('V');
        if (entity.direction.y === -1) line.push('^');
      }
      else {
        switch (maze[y][x]) {
          case -1: line.push('#'); break;
          case 0:  line.push('.'); break;
          default: break;
        }
      }
    }
    console.log(line.join(''));
  }
}

type Evaluation = {
  position: Vector;
  direction: Vector;
  score: number
}

const cardinals: Vector[] = [
  {x: 0, y: -1}, // North
  {x: 1, y: 0},  // East
  {x: 0, y: 1},  // South
  {x: -1, y: 0},  // West
];

function solve(maze: preparedData): number {
  let retVal = 0;
  const queue: Evaluation[] = [{
    position: vu.clone(maze.start),
    direction: {x: 1, y: 0},
    score: 0
  }];

  const visited: Map<string, number> = new Map<string, number>();

  do {
    const current: Evaluation = queue.pop() as Evaluation;

    // Ensure we're in bounds
    if (!au.isInBounds2d(maze.maze, current.position)) {
      continue;
    }

    // Have we checked this before?
    if (visited.has(`${vu.toString(current.position)}:${vu.toString(current.direction)}`)) {
      if ((visited.get(`${vu.toString(current.position)}:${vu.toString(current.direction)}`) as number) <= current.score) {
        continue;
      }
    }

    // Are we at the end?
    if (vu.equals(maze.end, current.position)) {
      //console.log(`Found path: previous ${retVal}: current: ${current.score}`)
      retVal = (retVal > 0) ? Math.min(retVal, current.score) : current.score;
    }

    // Queue all valid moves from this position in the maze...
    for (const cardinal of cardinals) {

      const next = {
        position: vu.add(current.position, cardinal),
        direction: cardinal,
        score: vu.equals(current.direction, cardinal) ? current.score + 1 : current.score + 1001
      }

      // Bounds Check
      if (!au.isInBounds2d(maze.maze, next.position)) {
        continue;
      }

      // Is it Wall?
      if (maze.maze[next.position.y][next.position.x] === -1) {
        continue;
      }

      // Ignore 180
      if (vu.equals(vu.add(current.direction, cardinal), {x: 0, y: 0})) {
        //continue;
      }

      // Have we been there before?
      if (visited.has(`${vu.toString(next.position)}:${vu.toString(next.direction)}`)) {
        if ((visited.get(`${vu.toString(next.position)}:${vu.toString(next.direction)}`) as number) <= next.score) {
          continue;
        }
      }

      // Add to the queue
      queue.push(next);
    }

    // Mark this as visited.
    visited.set(`${vu.toString(current.position)}:${vu.toString(current.direction)}`, current.score);

  } while (queue.length > 0);
  
  return retVal;
}

function exercise1(data: preparedData): number {
  return solve(data);
};

function exercise2(data: preparedData): number {
  let retVal = 0;
  return retVal;
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const test2 = prepareData(await readFile(`./data/day${day}/sample2.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test);
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 7036);

// Exercise 1: Test Case 2
answer = exercise1(test2);
console.log(`- Test 2 = '${answer}'`);
console.assert(answer === 11048);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 1415498);

// Exercise 2: Test Case
// answer = exercise2(test);
// console.log(`- Test 2 = '${answer}'`);
// console.assert(answer === 9021);

// Exercise 2: Answer
// answer = await exercise2(real);
// console.log(`- Exercise 2 = '${answer}'`);
// console.assert(answer === 6398);