import type { Vector } from '../types/vector';

export type Scaler = number;
export type Radian = number;

// See https://docs.godotengine.org/en/stable/tutorials/math/vector_math.html

const re = new RegExp(/^\((?<x>\d+),(?<y>\d+)\)$/);

export function create(x: number = 0, y: number = 0): Vector {
  return {
    x,
    y
  };
}

export function clone(v: Vector): Vector {
  return { ...v };
}


export function round(v: Vector): Vector {
  return {
    x: Math.round(v.x),
    y: Math.round(v.y)
  };
}

export function normalise(v: Vector): Vector {
  const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
  return {
    x: v.x / magnitude,
    y: v.y / magnitude
  };
}

export function add(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

export function subtract(a: Vector, b: Vector): Vector {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

export function multiply(a: Vector, b: Vector): Vector {
  return {
    x: a.x * b.x,
    y: a.y * b.y
  };
}

export function scale(a: Vector, factor: number): Vector {
  return {
    x: a.x * factor,
    y: a.y * factor
  };
}

export function rotate(v: Vector, radians: Radian): Vector {
  return {
    x: v.x * Math.cos(radians) - v.y * Math.sin(radians),
    y: v.x * Math.sin(radians) + v.y * Math.cos(radians)
  };
}

export function dot(a: Vector, b: Vector): Scaler {
  return a.x * b.x + a.y * b.y;
}

export function angle(a: Vector, b?: Vector): Radian {
  if (b !== undefined) {
    return Math.acos(dot(a, b));
  }
  return Math.atan2(a.y, a.x);
}

export function toString(v: Vector): string {
  return `(${v.x},${v.y})`;
}

export function fromString(str: string): Vector | undefined {
  const match = str.match(re);
  if (match) {
    return {
      x: parseInt(match[1]),
      y: parseInt(match[2])
    }
  }
  return;
}