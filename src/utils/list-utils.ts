export type Node<Type> = {
  next: Node<Type> | undefined;
  value: Type;
}

export function create<Type>(value: Type, next: Node<Type> | undefined = undefined): Node<Type> {
  return {
    next,
    value
  }
}

export function fromArray<Type>(array: Type[]): Node<Type> {
  let start: Node<Type> | undefined = undefined;
  let end: Node<Type> | undefined = undefined;
  for (const entry of array) {
    const node = create(entry);
    if (start === undefined) {
      start = node;
    } else {
      insert(node, end as Node<Type>)
    }
    end = node;
  }
  return start as Node<Type>;
}

export function toArray<Type>(start: Node<Type>): Type[] {
  let retVal = [];
  let current = start;
  do {
    retVal.push(current?.value);
    current = current.next as Node<Type>;
  } while (current !== undefined)
  return retVal;
}

export function insert<Type>(item: Node<Type>, after: Node<Type>): void {
  item.next = after.next;
  after.next = item;
}

export function size<Type>(start: Node<Type>): number {
  let retVal = 0;
  let current: Node<Type> | undefined = start;
  do {
    retVal += 1;
    current = current.next;
  } while (current !== undefined)
  return retVal;
}
