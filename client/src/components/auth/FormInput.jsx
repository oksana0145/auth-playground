import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  showErrorMessage = true,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const inputClassName = `w-full rounded-xl border bg-white/55 px-4 py-3 ${
    isPassword ? "pr-12" : ""
  } text-[#12343D] outline-none transition ${
    error
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-[#00546F]/15 focus:border-[#00546F] focus:ring-2 focus:ring-[#00546F]/15"
  }`;

  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-[#12343D]"
        htmlFor={name}
      >
        {label}
      </label>

      <div className="relative">
        <input
          className={inputClassName}
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#60777C] transition duration-200 hover:text-[#00546F] active:scale-90"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>
        )}
      </div>
      {error && showErrorMessage && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default FormInput;
