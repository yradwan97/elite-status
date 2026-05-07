import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneFieldProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PhoneField({ value, onChange, disabled = false }: PhoneFieldProps) {
  return (
    <div className={`border rounded-lg px-3 py-2 transition-colors ${
      disabled ? "bg-gray-100 border-gray-200 cursor-default" : "bg-white"
    }`}>
      <PhoneInput
        international
        defaultCountry="KW"
        value={value}
        onChange={(val) => onChange(val || "")}
        disabled={disabled}
        className="w-full outline-none"
      />
    </div>
  );
}