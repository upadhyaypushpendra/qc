import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      navigate('/');
    } catch {
      // Error handled in the hook
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-brand-50 border-2 border-brand-200 rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6 text-brand-700">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
            autoComplete='username'
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            autoComplete='current-password'
            required
          />
        </div>
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full bg-brand-600 text-white py-2 rounded font-bold hover:bg-brand-700 disabled:bg-gray-300"
        >
          {login.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-4 text-sm text-brand-700">
        No account?{' '}
        <Link to="/auth/register" className="text-brand-700 font-bold hover:text-brand-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
