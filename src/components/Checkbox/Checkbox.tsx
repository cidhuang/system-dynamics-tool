import "./Checkbox.css";
import Image from "next/image";

export const Checkbox = ({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (event: any) => void;
  icon: string;
}) => {
  return (
    <div className="checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="checkbox-input"
      />
      <label className="checkbox-label" onClick={onChange}>
        {label}
      </label>
      <img
        className="checkbox-img"
        src={icon}
        width={32}
        height={32}
        onClick={onChange}
        alt={label}
      />
    </div>
  );
};
