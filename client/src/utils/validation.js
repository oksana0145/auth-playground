export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@.]+$/.test(email);
};

export const getPasswordRequirements = (password) => [
  {
    label: "at least 8 characters",
    isValid: password.length >= 8,
  },
  {
    label: "at least 1 uppercase letter",
    isValid: /[A-Z]/.test(password),
  },
  {
    label: "at least 1 number",
    isValid: /\d/.test(password),
  },
];

export const validateLoginForm = (values) => {
  const errors = {};

  if (!isValidEmail(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Invalid password";
  }

  return errors;
};

export const validateRegisterForm = (values) => {
  const errors = {};

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
  } else if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else {
    const requirements = getPasswordRequirements(values.password);

    const failedRequirement = requirements.find(
      (requirement) => !requirement.isValid
    );

    if (failedRequirement) {
      errors.password = `Password must contain ${failedRequirement.label}`;
    }
  }

  return errors;
};