function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
}) {
  const inputClassName = `w-full rounded-xl border bg-white/55 px-4 py-3 text-[#12343D] outline-none transition ${
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

      <input
        className={inputClassName}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;