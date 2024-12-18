import type { Vector } from "../types/vector";

import * as vu from "./vector-utils.ts";
import * as au from "./array-utils.ts";

export type Node = {
  position: Vector;
  direction: Vector;
  parent: Node | undefined;
}

export type Path = Node[];

export function frontier<Type>(array: Type[][], start: Vector, end: Vector, avoid: Type[]): Path {
  let retVal: Path = [];

  const openList: Node[] = [{
    position: start,
    direction: vu.create(1, 0),
    parent: undefined
  }];

  const closedList: Node[] = [];

  do {
    let currentNode = openList.shift() as Node;

    // Have we reached the end?
    if (vu.equals(currentNode.position, end)) {
      let current = currentNode;
      while (current) {
        retVal.push(current);
        current = current.parent as Node;
      }
      retVal = retVal.reverse();
      break;
    }

    // Queue all valid moves from this position in the maze...
    for (const cardinal of vu.cardinals) {

      const next: Node = {
        position: vu.add(currentNode.position, cardinal),
        direction: cardinal,
        parent: currentNode
      }

      // Ensure the Node is within bounds
      if (!au.isInBounds2d(array, next.position)) {
        continue;
      }

      // Is the value of the Node in the Avoid list?
      if (avoid.includes(array[next.position.y][next.position.x])) {
        continue;
      }

      // Have we been to this Node before?
      if (closedList.find((node) => vu.equals(next.position, node.position) && vu.equals(next.direction, node.direction))) {
        continue;
      }

      // Is this Node already queued?
      if (openList.find((node) => vu.equals(next.position, node.position) && vu.equals(next.direction, node.direction))) {
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