import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import FormInput from "../components/auth/FormInput.jsx";
import Button from "../components/auth/Button.jsx";

const initialFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

function validateRegisterForm(values) {
  const errors = {};
  const emailDomain = values.email.split("@")[1];

  if (!values.firstName.trim()) {
    errors.firstName = "First Name is required";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last Name is required";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (/\s/.test(values.email)) {
    errors.email = "Email cannot contain spaces";
  } else if (!values.email.includes("@")) {
    errors.email = "Email must contain @";
  } else if (!emailDomain || !emailDomain.includes(".")) {
    errors.email = "Email must contain a domain with a dot after @";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must contain at least 8 characters";
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/\d/.test(values.password)) {
    errors.password = "Password must contain at least one number";
  }

  return errors;
}

function RegisterPage() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(`idle`);
  const [submitMessage, setSubmitMessage] = useState(``);

  const navigate = useNavigate();

  const passwordRequirements = [
    {
      label: "at least 8 characters",
      isValid: formValues.password.length >= 8,
    },
    {
      label: "at least 1 uppercase letter",
      isValid: /[A-Z]/.test(formValues.password),
    },
    {
      label: "at least 1 number",
      isValid: /\d/.test(formValues.password),
    },
  ];

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

      setSubmitStatus("success");
      setSubmitMessage("Check your email to verify account");
      setFormValues(initialFormValues);
      setErrors({});
      navigate(`/verify-email`);
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
