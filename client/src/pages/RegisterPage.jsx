import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const nextFormValues = {
      ...formValues,
      [name]: value,
    };

    setFormValues(nextFormValues);

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const fieldErrors = validateRegisterForm(nextFormValues);
      const nextErrors = { ...currentErrors };

      if (fieldErrors[name]) {
        nextErrors[name] = fieldErrors[name];
      } else {
        delete nextErrors[name];
      }

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
      <h1 className="mb-8 text-center text-2xl font-semibold text-slate-900">
        Create account
      </h1>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormInput
          label="First Name"
          name="firstName"
          value={formValues.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />

        <FormInput
          label="Last Name"
          name="lastName"
          value={formValues.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />

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

        <div>
          <ul className="mt-1 space-y-1 text-sm">
            {passwordRequirements.map((requirement) => (
              <li
                key={requirement.label}
                className={
                  requirement.isValid ? "text-green-600" : "text-slate-500"
                }
              >
                {requirement.isValid ? "✓" : "–"} {requirement.label}
              </li>
            ))}
          </ul>
        </div>

        {submitMessage && (
          <p
            className={`text-sm ${
              submitStatus === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {submitMessage}
          </p>
        )}

        <Button type="submit" disabled={submitStatus === "loading"}>
          {submitStatus === "loading"
            ? "Creating account..."
            : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
export default RegisterPage;
