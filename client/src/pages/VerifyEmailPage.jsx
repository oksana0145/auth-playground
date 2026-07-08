import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const pageContent = {
  "check-email": {
    title: "Check your email",
    text: "We sent a verification link to your email address. Open that link to confirm your account before signing in.",
  },
  loading: {
    title: "Verifying your email...",
    text: "Please wait while we confirm your account.",
  },
  success: {
    title: "Email verified successfully",
    text: "Thank you for confirming your email. You can now sign in.",
  },
}

function VerifyEmailPage() {
  const token = new URLSearchParams(window.location.search).get("token")

  const initialStatus = token ? "loading" : "check-email"

  const [status, setStatus] = useState(initialStatus)
  const [message, setMessage] = useState("")
  const hasVerified = useRef(false)

  useEffect(() => {
  if (!token || hasVerified.current) {
    return
  }

  hasVerified.current = true

  const verifyEmail = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/auth/verify-email?token=${token}`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed')
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  verifyEmail()
}, [token])

const content = 
status === "error" ? {
  title: "Verification failed",
  text: message || "This Link is invalid or expired."
} : pageContent[status]

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">
          {content.title}
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {content.text}
        </p>
{status === 'check-email' && (
  <div className="flex justify-center gap-4">
    <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/login">
      Login
    </Link>

    <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/register">
      Register
    </Link>
  </div>
)}
<div className="mt-6 text-sm">
  {status === 'success' && (
    <Link
      className="inline-block rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700"
      to="/login"
    >
      Go to login
    </Link>
  )}

  {status === 'error' && (
    <div className="flex justify-center gap-4">
      <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/login">
        Login
      </Link>

      <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/register">
        Register
      </Link>
    </div>
  )}
</div>
      </div>
    </section>
  )
}

export default VerifyEmailPage
