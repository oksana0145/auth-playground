import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, resendVerificationEmail } from "../api/authApi";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import FormInput from "../components/auth/FormInput.jsx";
import Button from "../components/auth/Button.jsx";

const initialFormValues = {
  email: "",
  password: "",
};

function validateLoginForm(values) {
  const errors = {};
  const emailDomain = values.email.split("@")[1];

  if (!values.email.trim()) {
    errors.email = "Invalid email address";
  } else if (!values.email.includes("@")) {
    errors.email = "Invalid email address";
  } else if (!emailDomain || !emailDomain.includes(".")) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Invalid password";
  }

  return errors;
}

function LoginPage() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const navigate = useNavigate();
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginUser } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSubmitError("");
    setShowResendVerification(false);
    setResendMessage("");
    setResendError("");

    const nextFormValues = {
      ...formValues,
      [name]: value,
    };

    setFormValues(nextFormValues);

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setShowResendVerification(false);
    setResendMessage("");
    setResendError("");

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

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      setResendMessage("");
      setResendError("");

      const data = await resendVerificationEmail(formValues.email);

      setResendMessage(data.message);
    } catch (error) {
      setResendError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="mb-8 text-center text-2xl font-semibold text-[#12343D]">
        Welcome back
      </h1>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          error={errors.email}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          error={errors.password}
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
                    onClick={handleResendVerification}
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
