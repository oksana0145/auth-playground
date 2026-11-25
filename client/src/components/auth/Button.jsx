function Button({
  children,
  type = "button",
  disabled = false,
  onClick,
}) {
  return (
    <button
      className="w-full rounded-xl bg-[#00546F] px-4 py-3 font-medium text-white transition hover:bg-[#004456] focus:outline-none focus:ring-2 focus:ring-[#00546F]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;