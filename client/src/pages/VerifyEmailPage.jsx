import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { verifyEmail, resendVerificationEmail } from "../api/authApi";

const pageContent = {
  "check-email": {
    title: "Check your email",
    text: "We sent a verification link to your email address. Open that link to confirm your account before signing in. The link is valid for 24 hours.",
  },
  loading: {
    title: "Verifying your email...",
    text: "Please wait while we confirm your account.",
  },
  success: {
    title: "Email verified successfully",
    text: "Thank you for confirming your email. You can now sign in.",
  },
};

function VerifyEmailPage() {
  const token = new URLSearchParams(window.location.search).get("token");

  const initialStatus = token ? "loading" : "check-email";

  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token || hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verifyEmailRequest = async () => {
      try {
        await verifyEmail(token);

        setStatus("success");
      } catch (error) {
        setStatus("error");
        setMessage(error.message);
      }
    };

    verifyEmailRequest();
  }, [token]);

  const content =
    status === "error"
      ? {
          title: "Verification failed",
          text: message || "This link is invalid or expired.",
        }
      : pageContent[status];

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      setResendMessage("");
      setResendError("");

      const data = await resendVerificationEmail(resendEmail);

      setResendMessage(data.message);
    } catch (error) {
      setResendError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">
          {content.title}
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">{content.text}</p>

        {status === "check-email" && (
          <div className="flex justify-center gap-4">
            <Link
              className="font-medium text-indigo-600 hover:text-indigo-700"
              to="/login"
            >
              Login
            </Link>

            <Link
              className="font-medium text-indigo-600 hover:text-indigo-700"
              to="/register"
            >
              Register
            </Link>
          </div>
        )}
        <div className="mt-6 text-sm">
          {status === "success" && (
            <Link
              className="inline-block rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700"
              to="/login"
            >
              Go to login
            </Link>
          )}

          {status === "error" && (
            <div>
              {!showResendForm && !resendMessage && (
                <button
                  type="button"
                  onClick={() => setShowResendForm(true)}
                  className="font-medium text-indigo-600 underline underline-offset-2 transition hover:text-indigo-700"
                >
                  Request a new verification email
                </button>
              )}

              {showResendForm && !resendMessage && (
                <div className="mt-4 space-y-3">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(event) => {
                      setResendEmail(event.target.value);
                      setResendError("");
                    }}
                    placeholder="Enter your email"
                    aria-label="Email addres"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isResending ? "Sending..." : "Send verification email"}
                  </button>

                  {resendError && (
                    <p className="text-sm text-red-600">{resendError}</p>
                  )}
                </div>
              )}

              {resendMessage && (
                <p className="text-sm text-green-600">{resendMessage}</p>
              )}

              <div className="mt-4 flex justify-center gap-4">
                <Link
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                  to="/login"
                >
                  Login
                </Link>

                <Link
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                  to="/register"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default VerifyEmailPage;
