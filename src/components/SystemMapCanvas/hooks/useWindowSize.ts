import { useState, useEffect, MutableRefObject } from "react";
import { Point } from "../lib/geometry";

export function useWindowSize(ref: MutableRefObject<null>): [
  {
    width: number;
    height: number;
  },
  Point,
] {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
      });

      const div = ref.current as unknown as HTMLElement;
      setOffset({
        x: div.offsetLeft,
        y: div.offsetTop,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount
  return [windowSize, offset];
}
