import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../api/apiFetch.jsx";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi.js";

function DashboardPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, accessToken, updateAccessToken, logoutUser } = useAuth();
  const navigate = useNavigate();
  const hasLoadedUser = useRef(false);

  useEffect(() => {
    if (!accessToken || hasLoadedUser.current) {
      return;
    }

    hasLoadedUser.current = true;

    const loadCurrentUser = async () => {
      try {
        const response = await apiFetch({
          url: "http://localhost:5000/auth/me",
          accessToken,
          updateAccessToken,
          logoutUser,
        });

        const data = await response.json();

        console.log("Current user:", data);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (accessToken) {
      loadCurrentUser();
    }
  }, [accessToken]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logout();

      logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7FCEB] px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/65 bg-white/45 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="border-b border-slate-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-[#00546F]">
            Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Welcome, {user.firstName}
          </h1>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#00546F]/10 bg-white/40 p-4">
            <p className="text-sm text-[#60777C]">Full name</p>

            <p className="mt-1 font-medium text-[#12343D]">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div className="rounded-xl border border-[#00546F]/10 bg-white/40 p-4">
            <p className="text-sm text-[#60777C]">Email</p>

            <p className="mt-1 font-medium text-[#12343D]">{user.email}</p>
          </div>

          <div className="rounded-xl border border-[#00546F]/10 bg-white/40 p-4">
            <p className="text-sm text-[#60777C]">Role</p>

            <p className="mt-1 font-medium capitalize text-[#12343D]">
              {user.role}
            </p>
          </div>

          <div className="rounded-xl border border-[#00546F]/10 bg-white/40 p-4">
            <p className="text-sm text-[#60777C]">Email status</p>

            <p className="mt-1 font-medium text-[#00546F]">
              {user.isEmailVerified ? "✓ Verified" : "Not verified"}
            </p>
          </div>
        </div>
        <button
          className="mt-8 rounded-xl border border-[#00546F]/20 px-5 py-3 font-medium text-[#00546F] transition hover:bg-[#00546F]/5 focus:outline-none focus:ring-2 focus:ring-[#00546F]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </section>
    </main>
  );
}

export default DashboardPage;
