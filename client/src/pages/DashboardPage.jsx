import { useAuth } from '../context/AuthContext.jsx'
import { useEffect, useRef } from 'react'
import { apiFetch } from '../api/apiFetch.jsx'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/authApi.js'

function DashboardPage() {
  const {user,
    accessToken,
    updateAccessToken,
    logoutUser} = useAuth()

     const navigate = useNavigate()
     const hasLoadedUser = useRef(false)

    useEffect(() => {
  if (!accessToken || hasLoadedUser.current) {
    return
  }

  hasLoadedUser.current = true

  const loadCurrentUser = async () => {
      try {
        const response = await apiFetch({
          url: 'http://localhost:5000/auth/me',
          accessToken,
          updateAccessToken,
          logoutUser,
        })

        const data = await response.json()

        console.log('Current user:', data)
      } catch (error) {
        console.error(error.message)
      }
    }

    if (accessToken) {
      loadCurrentUser()
    }
  }, [accessToken])

  const handleLogout = async () => {
    try {
      await logout()

      logoutUser()

      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error.message)
    }
  }


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
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </section>
  )
}

export default DashboardPage
