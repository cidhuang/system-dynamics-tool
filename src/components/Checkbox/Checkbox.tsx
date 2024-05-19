import "./Checkbox.css";

export const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (event: any) => void;
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
    </div>
  );
};
