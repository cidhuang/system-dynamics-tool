import { useState, useEffect, SyntheticEvent } from "react";

import { Point } from "./lib/geometry";

export const InputTextArea = ({
  visible,
  xy,
  width,
  height,
  value0,
  onKeyEnterDown,
}: {
  visible: boolean;
  xy: Point;
  width: number;
  height: number;
  value0: string;
  onKeyEnterDown: (value: string) => void;
}) => {
  const [value, setValue] = useState<string>(value0);

  useEffect(() => {
    setValue(value0.replaceAll("\\n", "\\\n").replaceAll("\n", "\\n"));
  }, [value0, visible]);

  function handleKeyDown(event: SyntheticEvent) {
    const e = event as unknown as KeyboardEvent;
    if (e.code === "Enter") {
      if (value.replaceAll(" ", "").replaceAll("\n", "") === "") {
        onKeyEnterDown(value0);
        return;
      }
      onKeyEnterDown(value.replaceAll("\\n", "\n").replaceAll("\\\n", "\\n"));
    }
  }

  return (
    <div
      className="absolute"
      hidden={!visible}
      style={{ left: xy.x + "px", top: xy.y + "px" }}
    >
      <textarea
        placeholder=""
        value={value}
        onKeyDown={handleKeyDown}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: width, height: height, resize: "none" }}
      ></textarea>
    </div>
  );
};
