import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

function validateRegisterForm(values) {
  const errors = {}
  const emailDomain = values.email.split('@')[1]

  if (!values.firstName.trim()) {
    errors.firstName = 'First Name is required'
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last Name is required'
  }

  if (!values.email) {
    errors.email = 'Email is required'
  } else if (/\s/.test(values.email)) {
    errors.email = 'Email cannot contain spaces'
  } else if (!values.email.includes('@')) {
    errors.email = 'Email must contain @'
  } else if (!emailDomain || !emailDomain.includes('.')) {
    errors.email = 'Email must contain a domain with a dot after @'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  } else if (values.password.length < 8) {
    errors.password = 'Password must contain at least 8 characters'
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = 'Password must contain at least one uppercase letter'
  } else if (!/\d/.test(values.password)) {
    errors.password = 'Password must contain at least one number'
  }

  return errors
}

function RegisterPage() {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(`idle`)
  const [submitMessage, setSubmitMessage] = useState(``)

  const navigate = useNavigate()

  const passwordRequirements = [
    {
      label: 'at least 8 characters',
      isValid: formValues.password.length >= 8,
    },
    {
      label: 'at least 1 uppercase letter',
      isValid: /[A-Z]/.test(formValues.password),
    },
    {
      label: 'at least 1 number',
      isValid: /\d/.test(formValues.password),
    },
  ]
  const hasPasswordInput = formValues.password.length > 0

  const getInputClassName = (fieldName) =>
    `w-full rounded-lg border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 ${
      errors[fieldName]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
    }`

  const handleChange = (event) => {
    const { name, value } = event.target

    const nextFormValues = {
      ...formValues,
      [name]: value,
    }
    const fieldErrors = validateRegisterForm(nextFormValues)

    setFormValues(nextFormValues)
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }

      if (fieldErrors[name]) {
        nextErrors[name] = fieldErrors[name]
      } else {
        delete nextErrors[name]
      }

      return nextErrors
    })
  }

  const handleSubmit = async (event) => {
  event.preventDefault()

  const validationErrors = validateRegisterForm(formValues)
  setErrors(validationErrors)
  setSubmitMessage('')
  setSubmitStatus('idle')

  if (Object.keys(validationErrors).length > 0) {
    return
  }

  setSubmitStatus('loading')

  try {
    const response = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    setSubmitStatus('success')
    setSubmitMessage('Check your email to verify account')
    setFormValues(initialFormValues)
    setErrors({})
    navigate(`/verify-email`)
  } catch (error) {
    setSubmitStatus('error')
    setSubmitMessage(error.message)
  }
}


  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-left shadow-lg ring-1 ring-slate-200">
        <h1 className="mb-8 text-center text-2xl font-semibold text-slate-900">
          Create account
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className={getInputClassName('firstName')}
              id="firstName"
              name="firstName"
              type="text"
              value={formValues.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className={getInputClassName('lastName')}
              id="lastName"
              name="lastName"
              type="text"
              value={formValues.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={getInputClassName('email')}
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
              className={getInputClassName('password')}
              id="password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
            <div className="mt-2 text-left text-xs">
              <p className="font-medium text-slate-500">
                Password requirements:
              </p>
              <ul className="mt-1 space-y-1">
                {passwordRequirements.map((requirement) => (
                  <li
                    className={
                      hasPasswordInput
                        ? requirement.isValid
                          ? 'text-green-600'
                          : 'text-red-600'
                        : 'text-slate-500'
                    }
                    key={requirement.label}
                  >
                    - {requirement.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {submitMessage && (
  <p
    className={`text-sm ${
      submitStatus === 'success' ? 'text-green-600' : 'text-red-600'
    }`}
  >
    {submitMessage}
  </p>
)}

          <button
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
            type="submit"
            disabled={submitStatus === `loading`}
          >
            {submitStatus === `loading` ? `Creating account..` : `Create account`}
          </button>
        </form>
      </div>
    </section>
  )
}
export default RegisterPage
