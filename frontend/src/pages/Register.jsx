import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../features/auth/authSlice.js';
import { Input } from '../components/Input.jsx';
import { Link } from 'react-router-dom';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', shopName: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      shopName: form.shopName.trim(),
    };
    if (payload.role !== 'seller') delete payload.shopName;
    const result = await dispatch(register(payload));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="container page py-10 flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
      <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 md:p-10 shadow-md">
        <div className="text-center mb-8">
          <span className="rounded-lg bg-[var(--color-primary-600)] px-2 py-0.5 text-xs font-bold text-[var(--on-primary)]">I</span>
          <h1 className="page-title mt-3">Create account</h1>
          <p className="page-subtitle">Join IronNest and start training</p>
        </div>

        {status === 'loading' ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-[var(--color-primary-600)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Sarah Strength"
              required
            />
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

            <fieldset className="rounded-lg border border-[var(--border)] bg-[var(--bg-page)] p-3">
              <legend className="px-1 text-xs font-semibold text-[var(--color-gray-500)] uppercase">I am a</legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={form.role === 'customer'}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                  Customer
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={form.role === 'seller'}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                  Seller
                </label>
              </div>
            </fieldset>

            {form.role === 'seller' && (
              <Input
                id="shopName"
                label="Shop name"
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                placeholder="e.g. Strength & Iron Co."
                required
              />
            )}

            {error && (
              <div role="alert" className="rounded-md bg-[var(--color-danger-50)] p-3 text-[var(--color-danger-700)] text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="min-h-[var(--control-md)] w-full rounded-md bg-[var(--color-primary-600)] px-4 text-sm font-semibold text-[var(--on-primary)] transition hover:bg-[var(--color-primary-700)] disabled:opacity-50"
              disabled={status === 'loading'}
            >
              Create account
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[var(--color-gray-500)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-primary-600)] hover:underline font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
