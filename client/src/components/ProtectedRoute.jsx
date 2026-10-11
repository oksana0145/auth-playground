import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import AnimatedBackground from "./ui/AnimatedBackground";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();

if (isAuthLoading) {
  return (
    <main
      className="relative isolate flex min-h-screen items-center justify-center"
      role="status"
      aria-label="Restoring session"
    >
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/40 border-t-neutral-700"
          aria-hidden="true"
        />

        <p className="text-sm text-neutral-600">
          Restoring your session...
        </p>
      </div>
    </main>
  );
}
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
