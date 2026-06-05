import { Link } from 'react-router-dom'

function VerifyEmailPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">
          Check your email
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          We sent a verification link to your email address. Open that link to
          confirm your account before signing in.
        </p>

        <button
          className="mt-8 w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          type="button"
        >
          Resend verification link
        </button>

        <div className="mt-6 flex justify-center gap-4 text-sm">
          <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/login">
            Login
          </Link>
          <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/register">
            Register
          </Link>
        </div>
      </div>
    </section>
  )
}

export default VerifyEmailPage
