/**
 * The poisition of a point
 * @property x x of point
 * @prop y y of point
 * @interface
 */
export interface Point {
  x: number;
  y: number;
}

function indexOf(array: any[], name: string): number {
  for (let i = 0; i < array.length; i++) {
    if (array[i].name === name) {
      return i;
    }
  }
  return -1;
}

export interface Variable {
  name: string;
  text: string;
  x: number;
  y: number;
}

export function isVariable(name: string): boolean {
  return name.startsWith("variable-");
}

export function createVariable(
  variables: Variable[],
  x: number,
  y: number,
): string {
  let i = 0;
  while (indexOf(variables, "variable-" + i.toString()) >= 0) {
    i++;
  }

  const name = "variable-" + i.toString();
  variables.push({
    name: name,
    text: name,
    x: x,
    y: y,
  });

  return name;
}
