import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleCreate = () => {
    login('Jane Doe', 'jane@example.com')
    navigate('/dashboard')
  }

  return (
    <div className="grid min-h-screen grid-cols-2">
      <aside className="flex flex-col justify-center bg-primary-dark p-16 text-white">
        <h1 className="text-6xl font-semibold leading-tight">
          Master your finances.
          <br />
          <span className="text-primary">Elevate your freelance business.</span>
        </h1>
      </aside>
      <main className="flex items-center justify-center bg-surface-bg p-10">
        <div className="w-full max-w-md rounded-2xl border border-panel-border bg-white p-8">
          <h2 className="text-4xl font-semibold">Create an account</h2>
          <p className="mt-2 text-slate-600">Join Neto and take control of your business.</p>
          <button
            onClick={handleCreate}
            className="mt-6 w-full rounded-xl bg-primary py-3 font-medium text-white"
          >
            Create account
          </button>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary">
              Log in here
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
