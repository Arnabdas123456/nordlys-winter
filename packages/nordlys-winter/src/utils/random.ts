/**
 * Random number generator utilities for 3D winter calculations.
 */

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function randomVectorInBox(
  width: number,
  height: number,
  depth: number
): [number, number, number] {
  return [
    (Math.random() - 0.5) * width,
    Math.random() * height,
    (Math.random() - 0.5) * depth
  ];
}

