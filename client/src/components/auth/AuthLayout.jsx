import AnimatedBackground from "../ui/AnimatedBackground";

function AuthLayout({ children }) {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center px-4 py-8">
      <AnimatedBackground />

      <div className="w-full max-w-md rounded-3xl border border-white/65 bg-white/45 p-8 shadow-xl backdrop-blur-xl">
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;
