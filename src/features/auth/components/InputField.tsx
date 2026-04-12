
import i18next from "i18next";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  icon?: React.ElementType;
  register: UseFormRegister<T>;
  name: Path<T>;
  error?: string;
  isPassword?: boolean;
  dir?: "ltr" | "rtl";
};

export default function InputField<T extends FieldValues>({
  type = "text",
  placeholder,
  icon: Icon,
  register,
  name,
  error,
  isPassword,
}: InputFieldProps<T>) {
  const [show, setShow] = useState(false);

  const inputType = isPassword ? (show ? "text" : "password") : type;
  const dir = i18next.language === "ar" ? "rtl" : "ltr";

  const isRTL = dir === "rtl";

  return (
    <div className="w-full" dir={dir}>
      <div className="relative">
        {/* LEFT ICON (LTR) / RIGHT ICON (RTL) */}
        {Icon && (
          <Icon
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400
              ${isRTL ? "right-3" : "left-3"}`}
            size={18}
          />
        )}

        <input
          type={inputType}
          {...register(name)}
          placeholder={placeholder}
          dir={dir}
          className={`
            w-full py-3 rounded-lg border border-gray-200
            focus:outline-none focus:ring-2 focus:ring-navy
            ${isRTL ? "text-right pr-10 pl-10" : "text-left pl-10 pr-10"}
          `}
          style={{fontSize: "1.05rem"}}
        />

        {/* PASSWORD TOGGLE */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400
              ${isRTL ? "left-3" : "right-3"}`}
          >
            {show ? <EyeOff size={18} className="text-black" /> : <Eye size={18} className="text-black" />}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1 text-right">{error}</p>}
    </div>
  );
}