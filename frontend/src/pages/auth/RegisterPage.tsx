import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const register = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register.mutateAsync(form);
      navigate('/');
    } catch {
      // Error handled in the hook
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-brand-50 border-2 border-brand-200 rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6 text-brand-700">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-brand-700">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-brand-700">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            minLength={8}
            required
          />
        </div>
        <button
          type="submit"
          disabled={register.isPending}
          className="w-full bg-brand-600 text-white py-2 rounded font-bold hover:bg-brand-700 disabled:bg-gray-300"
        >
          {register.isPending ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-4 text-sm text-brand-700">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-brand-700 font-bold hover:text-brand-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
