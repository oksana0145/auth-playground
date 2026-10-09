import { useAuth } from "../context/AuthContext.jsx";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi.js";
import AnimatedBackground from "../components/ui/AnimatedBackground.jsx";
import {
  UserRound,
  Mail,
  Shield,
  BadgeCheck,
  Check,
  LogOut,
} from "lucide-react";

function DashboardPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const hasLoadedUser = useRef(false);

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
    <main className="relative isolate min-h-screen overflow-x-hidden px-4 py-8 sm:px-6">
      <AnimatedBackground />

      <section className="mx-auto w-full max-w-xl rounded-3xl border border-white/65 bg-white/45 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <header className="border-b border-[#00546F]/10 pb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-[#00546F]">
            Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#12343D]">
            Welcome, {user.firstName}
          </h1>
        </header>

        <div className="mt-6 divide-y divide-[#00546F]/10">
          <div className="flex items-center gap-4 py-4">
            <UserRound
              size={22}
              className="shrink-0 text-[#00546F]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-sm text-[#60777C]">Full name</p>

              <p className="mt-1 font-medium text-[#12343D]">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4">
            <Mail
              size={22}
              className="shrink-0 text-[#00546F]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-sm text-[#60777C]">Email</p>

              <p className="mt-1 break-all font-medium text-[#12343D]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4">
            <Shield
              size={22}
              className="shrink-0 text-[#00546F]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-sm text-[#60777C]">Role</p>

              <p className="mt-1 font-medium capitalize text-[#12343D]">
                {user.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4">
            <BadgeCheck
              size={22}
              className="shrink-0 text-[#00546F]"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-sm text-[#60777C]">Email status</p>

              <span
                className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                  user.isEmailVerified
                    ? "bg-[#D6FB00]/35 text-[#00546F]"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {user.isEmailVerified && <Check size={15} aria-hidden="true" />}

                {user.isEmailVerified ? "Verified" : "Not verified"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-[#00546F]/20 px-5 py-3 font-medium text-[#00546F] transition hover:bg-[#00546F]/5 focus:outline-none focus:ring-2 focus:ring-[#00546F]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={18} aria-hidden="true" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
