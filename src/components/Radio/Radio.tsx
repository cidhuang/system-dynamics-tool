import { useState } from "react";
import "./Radio.css";

export const Radio = ({
  label,
  value,
  checked,
  onClick,
}: {
  label: string;
  value: any;
  checked: boolean;
  onClick: (value: any) => void;
}) => {
  function onChange() {
    onClick(value);
  }
  return (
    <div className="radio">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="radio-input"
      />
      <label className="radio-label" onClick={onChange}>
        {label}
      </label>
    </div>
  );
};
