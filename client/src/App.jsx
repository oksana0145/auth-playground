import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardPage from './pages/DashboardPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import VerifyEmailPage from './pages/VerifyEmailPage.jsx'

function App() {
  return (
    <main className="app">
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>

  <nav className="fixed bottom-6 left-1/2 flex -translate-x-1/2 gap-4 text-sm">
    <Link to="/register">Register</Link>
    <Link to="/login">Login</Link>
    <Link to="/verify-email">Verify Email</Link>
    <Link to="/dashboard">Dashboard</Link>
  </nav>
</main>
  )
}

export default App
