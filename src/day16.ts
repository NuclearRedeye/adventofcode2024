import type { Vector } from './types/vector.ts';

import { readFile } from './utils/file-utils.ts';
import * as vu from './utils/vector-utils.ts';
import * as au from './utils/array-utils.ts';

const day = 16;

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

type Evaluation = {
  position: Vector;
  direction: Vector;
  distance: number;
  score: number;
  previous: Evaluation | undefined;
}

type Result = {
  score: number;
  tiles: number;
}

function solve(maze: preparedData): Result {
  let retVal = 0;
  const queue: Evaluation[] = [{
    position: vu.clone(maze.start),
    direction: {x: 1, y: 0},
    distance: Math.abs(vu.subtract(maze.end, maze.start).x + vu.subtract(maze.end, maze.start).y),
    score: 0,
    previous: undefined
  }];

  const routes: Evaluation[] = [];
  const visited: Map<string, number> = new Map<string, number>();

  do {
    const current: Evaluation = queue.shift() as Evaluation;

    // Ensure we're in bounds
    if (!au.isInBounds2d(maze.maze, current.position)) {
      continue;
    }

    // Have we checked this before?
    if (visited.has(`${vu.toString(current.position)}:${vu.toString(current.direction)}`)) {
      if ((visited.get(`${vu.toString(current.position)}:${vu.toString(current.direction)}`) as number) < current.score) {
        continue;
      }
    }

    // Are we at the end point?
    if (vu.equals(maze.end, current.position)) {
      retVal = (retVal > 0) ? Math.min(retVal, current.score) : current.score;
      routes.push(current);
    }

    // Queue all valid moves from this position in the maze...
    for (const cardinal of vu.cardinals) {

      const next: Evaluation = {
        position: vu.add(current.position, cardinal),
        direction: cardinal,
        distance: Math.abs((maze.end.x - current.position.x + cardinal.x) + (maze.end.y - current.position.y + cardinal.y)),
        score: vu.equals(current.direction, cardinal) ? current.score + 1 : current.score + 1001,
        previous: current
      }

      // Is the current score for this potential path already higher than the best route we've found, if so give up...
      if (retVal > 0 && next.score > retVal) {
        continue;
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
      if (vu.equals(vu.add(current.direction, cardinal), vu.origin)) {
        continue;
      }

      // Have we been there before?
      if (visited.has(`${vu.toString(next.position)}:${vu.toString(next.direction)}`)) {
        if ((visited.get(`${vu.toString(next.position)}:${vu.toString(next.direction)}`) as number) < next.score) {
          continue;
        }
      }

      // Add to the queue
      queue.push(next);
    }

    // Sort the list.
    queue.sort((a, b) => a.distance - b.distance);

    // Mark this as visited.
    visited.set(`${vu.toString(current.position)}:${vu.toString(current.direction)}`, current.score);

  } while (queue.length > 0);

  const unique: Set<string> = new Set<string>();
  for (const route of routes) {
    if (route.score === retVal) {
      let tile: Evaluation | undefined = route;
      do {
        unique.add(vu.toString(tile.position));
        tile = tile?.previous;
      } while (tile !== undefined);
    }
  }
  
  return {
    score: retVal,
    tiles: unique.size
  }
}

function exercise1(data: preparedData): number {
  return solve(data).score;
};

function exercise2(data: preparedData): number {
  return solve(data).tiles;
};

console.log(`Advent of Code 2024: Day ${day}`);

// Load data
const test = prepareData(await readFile(`./data/day${day}/sample.txt`));
const test2 = prepareData(await readFile(`./data/day${day}/sample2.txt`));
const real = prepareData(await readFile(`./data/day${day}/data.txt`));

// Exercise 1: Test Case
let answer = exercise1(test);
console.log(`- Test 1.1 = '${answer}'`);
console.assert(answer === 7036);

// Exercise 1: Test Case 2
answer = exercise1(test2);
console.log(`- Test 1.2 = '${answer}'`);
console.assert(answer === 11048);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 85420);

// Exercise 2: Test Case
answer = exercise2(test);
console.log(`- Test 2.1 = '${answer}'`);
console.assert(answer === 45);

// Exercise 2: Test Case 2
answer = exercise2(test2);
console.log(`- Test 2.1 = '${answer}'`);
console.assert(answer === 64);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 492);