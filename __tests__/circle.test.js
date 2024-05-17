import {
  getCircle,
  toDegree,
} from "../src/components/SystemMapCanvas/lib/geometry";

describe("Check getCircle", () => {
  test("Check the result of getCircle", () => {
    expect(
      getCircle({ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 200, y: 0 }),
    ).toStrictEqual({ center: { x: 100, y: 0 }, radius: 100 });
  });
});

describe("Check toDegree", () => {
  test("Check the result of toDegree", () => {
    expect(toDegree(Math.PI)).toBe(180);
  });

  test("Check the result of toDegree", () => {
    expect(toDegree(Math.PI / 4)).toBe(45);
  });
});
