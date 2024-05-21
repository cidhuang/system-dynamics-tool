import "./Radio.css";
import Image from "next/image";

export const Radio = ({
  label,
  value,
  checked,
  onClick,
  icon,
}: {
  label: string;
  value: any;
  checked: boolean;
  onClick: (value: any) => void;
  icon: string;
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
      <img
        className="radio-img"
        src={icon}
        width={32}
        height={32}
        onClick={onChange}
        alt={label}
      />
    </div>
  );
};
