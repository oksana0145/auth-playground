import { useState } from "react";
import { resendVerificationEmail } from "../api/authApi";

export function useResendVerification() {
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [isResending, setIsResending] = useState(false);

  const resetResendState = () => {
    setResendMessage("");
    setResendError("");
  };

  const resendVerification = async (email) => {
    if (isResending) return;

    setIsResending(true);
    resetResendState();

    try {
      const data = await resendVerificationEmail(email);
      setResendMessage(data.message);
    } catch (error) {
      setResendError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return {
    resendMessage,
    resendError,
    isResending,
    resendVerification,
    resetResendState,
    setResendError,
  };
}