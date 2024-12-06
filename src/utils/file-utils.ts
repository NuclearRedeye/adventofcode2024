import { open } from 'node:fs/promises';

export async function readFile(filename: string) : Promise<string[]> {
  const retVal: string[] = [];
  const file = await open(filename);

  for await (const line of file.readLines()) {
    retVal.push(line);
  }
  return retVal;
}

export function dumpFile(data: string[]): void {
  for (const line of data) {
    console.log(line);
  }
}

