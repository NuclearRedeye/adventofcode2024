import { validateHeaderName } from 'http';
import { readFile } from './utils/file-utils.ts';

const day = 7;

type Equation = {
  answer: number;
  values: number[];
}

/*
enum Operators {
  ADD = 0,
  SUBTRACT = 1,
  MULTIPLY = 2,
  DIVIDE = 3,
  CONCAT = 4
}
*/

type preparedData = Equation[]

const re = new RegExp(/^\((?<x>\d+),(?<y>\d+)\)$/);

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = [];

  for (const line of data) {
    const split = line.split(":");
    retVal.push( {
      answer: parseInt(line.split(":")[0]),
      values: split[1].trim().split(' ').map((n) => parseInt(n))
    });
  }

  return retVal;
};


function getPermutations<Type>(operators: number[], iterations: number): Type[] {

  const permutations: Type[] = [];

  const combinations = (solution: Type[] = []) => {
    if(solution.length === iterations) {
      permutations.push(solution as Type);
      return;
    }
    operators.forEach(option => {
      combinations([...solution, option])
    })
  }

  combinations();

  return permutations
}

function calculate(equation: Equation, operators: number[]): number[] {
  const retVal = [];

  // 1. Calculate operator permutations based on length of equations values;
  const permutations: number[][] = getPermutations(operators, equation.values.length - 1);

  // 2. Run the calculation for each permutation, and add the result to the return array.
  for (const permutation of permutations) {
    const result: number = permutation.reduce((sum, value, index) => {
      switch(value) {
        case 0: return sum + equation.values[index + 1]; // Operators.ADD
        case 1: return sum - equation.values[index + 1]; // Operators.SUBTRACT
        case 2: return sum * equation.values[index + 1]; // Operators.MULTIPLY
        case 3: return sum / equation.values[index + 1]; // Operators.DIVIDE
        case 4: return parseInt(`${sum}${equation.values[index + 1]}`); // Operators.CONCAT
        default: return 0;
      }
    }, equation.values[0]);

    retVal.push(result);
  }

  return retVal;
}

function exercise1(data: preparedData): number {
  let retVal = 0;

  const operators = [0, 2]; // [Operators.ADD, Operators.MULTIPLY]
  for (const equation of data) {

    const calculation = calculate(equation, operators);
    for (const result of calculation) {
      if (result === equation.answer){
        retVal += equation.answer;
        break;
      }
    }
  }
  return retVal;
};

function exercise2(data: preparedData): number {
  let retVal = 0;

  const operators = [0, 2, 4]; // [Operators.ADD, Operators.MULTIPLY, Operators.CONCAT]
  for (const equation of data) {

    const calculation = calculate(equation, operators);
    for (const result of calculation) {
      if (result === equation.answer){
        retVal += equation.answer;
        break;
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
console.log(`- Test 1 = '${answer}'`);
console.assert(answer === 3749);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 945512582195);

// Exercise 2: Test Case
answer = exercise2(test);
console.log(`- Test 2 = '${answer}'`);
console.assert(answer === 11387);

// Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 271691107779347);