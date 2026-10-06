import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { verifyEmail, resendVerificationEmail } from "../api/authApi";
import AuthLayout from "../components/auth/AuthLayout.jsx";

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
    <AuthLayout>
      {status === "check-email" && (
        <>
          <h1 className="mb-4 text-center text-2xl font-semibold text-[#12343D]">
            {content.title}
          </h1>

          <p className="text-center text-sm leading-6 text-[#60777C]">
            {content.text}
          </p>

          <p className="mt-6 text-center text-sm text-[#60777C]">
            Already verified?{" "}
            <Link
              className="font-medium text-[#00546F] transition hover:text-[#004456]"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </>
      )}

      {status === "loading" && (
        <div className="text-center">
          <div className="mx-auto mb-6 h-8 w-8 animate-spin rounded-full border-2 border-[#00546F]/20 border-t-[#00546F]" />

          <h1 className="mb-4 text-2xl font-semibold text-[#12343D]">
            {content.title}
          </h1>

          <p className="text-sm leading-6 text-[#60777C]">{content.text}</p>
        </div>
      )}
      {status === "success" && (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#D6FB00]/30 text-xl font-semibold text-[#00546F]">
            ✓
          </div>

          <h1 className="mb-4 text-2xl font-semibold text-[#12343D]">
            {content.title}
          </h1>

          <p className="mb-6 text-sm leading-6 text-[#60777C]">
            {content.text}
          </p>

          <Link
            className="block w-full rounded-xl bg-[#00546F] px-4 py-3 font-medium text-white transition hover:bg-[#004456] focus:outline-none focus:ring-2 focus:ring-[#00546F]/30 focus:ring-offset-2"
            to="/login"
          >
            Go to login
          </Link>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl font-semibold text-red-600">
            !
          </div>

          <h1 className="mb-4 text-2xl font-semibold text-[#12343D]">
            {content.title}
          </h1>

          <p className="text-sm leading-6 text-red-600" role="alert">
            {content.text}
          </p>
          {!showResendForm && !resendMessage && (
            <button
              type="button"
              onClick={() => setShowResendForm(true)}
              className="mt-6 font-medium text-[#00546F] underline underline-offset-2 transition hover:text-[#004456]"
            >
              Request a new verification email
            </button>
          )}
          {showResendForm && !resendMessage && (
            <div className="mt-6 space-y-4 text-left">
              <label
                className="block text-sm font-medium text-[#12343D]"
                htmlFor="resendEmail"
              >
                Email
              </label>

              <input
                id="resendEmail"
                type="email"
                value={resendEmail}
                onChange={(event) => {
                  setResendEmail(event.target.value);
                  setResendError("");
                }}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-[#00546F]/15 bg-white/55 px-4 py-3 text-[#12343D] outline-none transition focus:border-[#00546F] focus:ring-2 focus:ring-[#00546F]/15"
              />

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full rounded-xl bg-[#00546F] px-4 py-3 font-medium text-white transition hover:bg-[#004456] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Send verification email"}
              </button>
              {resendError && (
                <p className="text-center text-sm text-red-600" role="alert">
                  {resendError}
                </p>
              )}
            </div>
          )}
          {resendMessage && (
            <div className="mt-6 rounded-xl bg-[#D6FB00]/20 px-4 py-3">
              <p
                className="text-center text-sm leading-6 text-[#00546F]"
                role="status"
              >
                {resendMessage}
              </p>
            </div>
          )}
        </div>
      )}
    </AuthLayout>
  );
}

export default VerifyEmailPage;
