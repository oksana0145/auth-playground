import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { useAuth } from "../context/useAuth.js";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import FormInput from "../components/auth/FormInput.jsx";
import Button from "../components/auth/Button.jsx";
import { validateLoginForm } from "../utils/validation.js";
import { useResendVerification } from "../hooks/useResendVerification.js";

const initialFormValues = {
  email: "",
  password: "",
};

function LoginPage() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser } = useAuth();
  const {
    resendMessage,
    resendError,
    isResending,
    resendVerification,
    resetResendState,
  } = useResendVerification();

  const resetMessages = () => {
    setSubmitError("");
    setShowResendVerification(false);
    resetResendState();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    resetMessages();

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();

    const validationErrors = validateLoginForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await login(formValues);

      loginUser(data);
      navigate("/dashboard");
    } catch (error) {
      setSubmitError(error.message);

      if (error.status === 403) {
        setShowResendVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-[#12343D]">Welcome back</h1>
        <p className="mt-1 text-sm text-[#60777C]">Sign in to your account</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="username"
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        {submitError && (
          <p className="text-sm text-red-600" role="alert">
            {submitError}
          </p>
        )}

        {showResendVerification && (
          <div>
            {resendMessage ? (
              <p className="text-sm text-[#00546F]" role="status">
                {resendMessage}
              </p>
            ) : (
              <>
                <p className="text-sm text-[#60777C]">
                  Didn&apos;t receive the verification email?{" "}
                  <button
                    type="button"
                    onClick={() => resendVerification(formValues.email)}
                    disabled={isResending}
                    className="font-medium text-[#00546F] underline underline-offset-2 transition hover:text-[#004456] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend email"}
                  </button>
                </p>

                {resendError && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {resendError}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#60777C]">
        Don&apos;t have an account?{" "}
        <Link
          className="font-medium text-[#00546F] transition hover:text-[#004456]"
          to="/register"
        >
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
