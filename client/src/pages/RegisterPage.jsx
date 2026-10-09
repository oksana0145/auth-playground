import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import FormInput from "../components/auth/FormInput.jsx";
import Button from "../components/auth/Button.jsx";
import { validateRegisterForm, getPasswordRequirements } from "../utils/validation.js";

const initialFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

function RegisterPage() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(`idle`);
  const [submitMessage, setSubmitMessage] = useState(``);

  const navigate = useNavigate();

  const passwordRequirements = getPasswordRequirements(formValues.password);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSubmitMessage("");
    setSubmitStatus("idle");

    setFormValues((currentValues) => ({
      ...currentValues,
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

    const validationErrors = validateRegisterForm(formValues);
    setErrors(validationErrors);
    setSubmitMessage("");
    setSubmitStatus("idle");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitStatus("loading");

    try {
      await register(formValues);
      navigate("/verify-email");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error.message);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-[#12343D]">
          Create account
        </h1>

        <p className="mt-1 text-sm text-[#60777C]">Join and get started</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormInput
          label="First Name"
          name="firstName"
          placeholder="Enter your first name"
          value={formValues.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />

        <FormInput
          label="Last Name"
          name="lastName"
          placeholder="Enter your last name"
          value={formValues.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formValues.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div className="space-y-2">
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formValues.password}
            onChange={handleChange}
            error={errors.password}
            showErrorMessage={false}
          />

          <ul className="space-y-1 text-xs">
            {passwordRequirements.map((requirement) => (
              <li
                key={requirement.label}
                className={`flex items-center gap-2 ${
                  requirement.isValid
                    ? "text-[#00546F]"
                    : errors.password
                      ? "text-red-600"
                      : "text-[#60777C]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    requirement.isValid
                      ? "bg-[#00546F]"
                      : errors.password
                        ? "bg-red-600"
                        : "bg-[#60777C]"
                  }`}
                  aria-hidden="true"
                />

                {requirement.label}
              </li>
            ))}
          </ul>
        </div>

        {submitMessage && submitStatus === "error" && (
          <p className="text-sm text-red-600" role="alert">
            {submitMessage}
          </p>
        )}

        <Button type="submit" disabled={submitStatus === "loading"}>
          {submitStatus === "loading"
            ? "Creating account..."
            : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[#60777C]">
        Already have an account?{" "}
        <Link
          className="font-medium text-[#00546F] transition hover:text-[#004456]"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
export default RegisterPage;
