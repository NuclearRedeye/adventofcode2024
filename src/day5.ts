import { readFile } from './utils.ts';

const day = 5;

type Rule = number[]
type Order = number[]

type preparedData = {
  rules: Rule[];
  orders: Order[];
}

function prepareData(data: string[]): preparedData {
  const retVal: preparedData = {
    rules: [],
    orders: []
  };

  let indexOrder = 0;
  let indexRule = 0;

  for (const line of data) {

    if (line.indexOf('|') > 0) {
      retVal.rules[indexRule++] = line.split('|').map((num: string) => parseInt(num));
    }

    if (line.indexOf(',') > 0) {
      retVal.orders[indexOrder++] = line.split(',').map((num: string) => parseInt(num));
    }

  }

  return retVal;
};

function checkOrder(order: Order, rules: Rule[]): boolean {
  for (let i = 0; i < order.length; i++) {
    for (const rule of rules) {
      if (order[i] === rule[0]) {
        for (let x = 0; x < i; x++){
          if (order[x] === rule[1]) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

function fixOrder(order: Order, rules: Rule[], depth = 0): Order {
  if (depth < order.length * order.length) {
    for (let i = 0; i < order.length; i++) {
      for (const rule of rules) {
        if (order[i] === rule[0]) {
          for (let x = 0; x < i; x++){
            if (order[x] === rule[1]) {
              const fixed = [...order];
              fixed[i] = order[x];
              fixed[x] = order[i];
              return fixOrder(fixed, rules, depth + 1);
            }
          }
        }
      }
    }
    return order;
  }
  return [];
}

function exercise1(data: preparedData): number {
  let retVal = 0;
  for (const order of data.orders) {
    if (checkOrder(order, data.rules)) {
      retVal += order[Math.floor(order.length / 2)];
    }
  }
  return retVal;
};

function exercise2(data: preparedData): number {
  let retVal = 0;
  for (const order of data.orders) {
    if (!checkOrder(order, data.rules)) {
      const fixed = fixOrder(order, data.rules);
      if (fixed.length === 0) {
        break;
      }

      retVal += fixed[Math.floor(fixed.length / 2)];
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
console.assert(answer === 143);

// Exercise 1: Answer
answer = exercise1(real);
console.log(`- Exercise 1 = '${answer}'`);
console.assert(answer === 4689);

// // Exercise 2: Test Case
answer = exercise2(test);
console.assert(answer === 123);

// // Exercise 2: Answer
answer = exercise2(real);
console.log(`- Exercise 2 = '${answer}'`);
console.assert(answer === 6336);