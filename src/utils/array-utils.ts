export function clone2d<Type>(array: Type[][]): Type[][] {
  const retVal = [];
  for (const y of array) {
    retVal.push([...y]); 
  }
  return retVal;
}