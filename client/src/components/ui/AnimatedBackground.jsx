function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F7FCEB]"
      aria-hidden="true"
    >
      <div className="gradient-blob gradient-blob--teal" />
      <div className="gradient-blob gradient-blob--lime" />
      <div className="gradient-blob gradient-blob--soft" />
      <div className="gradient-blob gradient-blob--turquoise" />
    </div>
  );
}

export default AnimatedBackground;