import { useAuth } from '../context/AuthContext.jsx'

function DashboardPage() {
  const {user, logoutUser} = useAuth()

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
        <div className="border-b border-slate-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
            Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Welcome, {user.firstName}
          </h1>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Full name</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Role</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {user.role}
            </p>
          </div>
        </div>

        <button
          className="mt-8 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          type="button"
          onClick={logoutUser}
        >
          Logout
        </button>
      </div>
    </section>
  )
}

export default DashboardPage
