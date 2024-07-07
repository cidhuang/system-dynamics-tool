import { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-export-i18n";

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
  const ref = useRef(null);
  const { t } = useTranslation();
  const inputName = t("input name");

  const [value, setValue] = useState<string>(value0);

  useEffect(() => {
    setValue(value0.replaceAll("\\n", "\\\n").replaceAll("\n", "\\n"));

    if (visible) {
      (ref.current as unknown as HTMLTextAreaElement).focus();
    }
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
    <textarea
      ref={ref}
      className="absolute rounded border border-black px-2"
      hidden={!visible}
      placeholder={inputName}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{
        left: xy.x + "px",
        top: xy.y + "px",
        width: width,
        height: height,
        resize: "none",
      }}
    ></textarea>
  );
};
