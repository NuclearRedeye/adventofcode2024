import type { Vector } from "../types/vector";

export function clone<Type>(array: Type[]): Type[] {
  const retVal: Type[] = new Array(array.length);
  for (let i = 0; i < array.length; i++) {
    retVal[i] = {...array[i]};
  } 
  return retVal;
}

export function clone2d<Type>(array: Type[][]): Type[][] {
  const retVal = [];
  for (const y of array) {
    retVal.push([...y]); 
  }
  return retVal;
}

export function isInBounds2d<Type>(array: Type[][], position: Vector): boolean {
  return (position.y >= 0 && position.y < array.length && position.x >= 0 && position.x < array[position.y].length);
}