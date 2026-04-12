

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneFieldProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function PhoneField({ value, onChange }: PhoneFieldProps) {
  return (
    <div className="border rounded-lg px-3 py-2">
      <PhoneInput
        international
        defaultCountry="KW"
        value={value}
        onChange={(val) => onChange(val || "")} // ✅ normalize undefined → ""
        className="w-full outline-none"
      />
    </div>
  );
}