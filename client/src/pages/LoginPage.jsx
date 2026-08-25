import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext.jsx";

const initialFormValues = {
  email: "",
  password: "",
};

function validateLoginForm(values) {
  const errors = {};
  const emailDomain = values.email.split("@")[1];

  if (!values.email.trim()) {
    errors.email = "Invalid email adress";
  } else if (!values.email.includes("@")) {
    errors.email = "Invalid email adress";
  } else if (!emailDomain || !emailDomain.includes(".")) {
    errors.email = "Invalid email adress";
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
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const getInputClassName = (fieldName) =>
    `w-full rounded-lg border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 ${
      errors[fieldName]
        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubmitError("");
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

    const validationErrors = validateLoginForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const data = await login(formValues);
      loginUser(data);
      navigate("/dashboard");
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-left shadow-lg ring-1 ring-slate-200">
        <h1 className="mb-8 text-center text-2xl font-semibold text-slate-900">
          Welcome, back
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={getInputClassName("email")}
              id="email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={getInputClassName("password")}
              id="password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

           { submitError && (
            <p className="mt-2 text-sm text-red-600">{submitError}</p>
          )}

          <button
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            type="submit"
          >
              Sign in
            </button>

      
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium text-indigo-600 hover:text-indigo-700"
            to="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
