import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice.js';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Link } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    try {
      await dispatch(login(form));
      navigate('/');
    } catch (err) {
      setServerError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="container page py-10 flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
      <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 md:p-10 shadow-md">
        <div className="text-center mb-8">
          <span className="rounded-lg bg-[var(--color-primary-600)] px-2 py-0.5 text-xs font-bold text-white">I</span>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-strong)] mt-3">Welcome back</h1>
          <p className="text-[var(--color-gray-500)] text-sm">Sign in to your IronNest account</p>
        </div>

        {status === 'loading' ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-[var(--color-primary-600)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />

            {serverError && (
              <div className="rounded-md bg-[var(--color-danger-50)] p-3 text-[var(--color-danger-700)] text-sm text-center">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-md bg-[var(--color-primary-600)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--color-primary-700)] transition disabled:opacity-50"
              disabled={status === 'loading'}
            >
              Sign in
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[var(--color-gray-500)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary-600)] hover:underline font-semibold">Create one</Link>
        </p>
        <p className="text-center text-xs text-[var(--color-gray-500)] mt-2">
          Demo: customer@ironnest.test / password123
        </p>
      </div>
    </div>
  );
}
