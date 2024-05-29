import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (
      value.length !== 0 &&
      value.replaceAll(" ", "").replaceAll("\n", "") === ""
    ) {
      onKeyEnterDown(value0);
      return;
    }
    if (value.indexOf("\n") >= 0) {
      onKeyEnterDown(
        value
          .replaceAll("\n", "")
          .replaceAll("\\n", "\n")
          .replaceAll("\\\n", "\\n"),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      className="absolute"
      hidden={!visible}
      style={{ left: xy.x + "px", top: xy.y + "px" }}
    >
      <textarea
        placeholder=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: width, height: height, resize: "none" }}
      ></textarea>
    </div>
  );
};
