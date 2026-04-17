import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import FolioLogo from '../components/FolioLogo';

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', countryCode: 'IN', currencyCode: 'INR' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin }  = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://ip-api.com/json/?fields=countryCode,currency')
      .then(r => r.json())
      .then(d => setForm(p => ({ ...p, countryCode: d.countryCode || 'IN', currencyCode: d.currency || 'INR' })))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await register(form);
      authLogin(res.data.user, res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><FolioLogo size={48} /></div>
          <h1 className="font-heading text-3xl font-bold text-folio-green">Join Folio</h1>
          <p className="text-folio-muted mt-1">Create your account and start sharing books</p>
        </div>
        <div className="card p-8">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
            </div>
            <div className="bg-folio-cream rounded-lg px-4 py-3 text-sm text-folio-muted flex items-center gap-2">
              <span>📍</span>
              <span>Auto-detected: <strong className="text-folio-green">{form.countryCode}</strong> · Currency: <strong className="text-folio-green">{form.currencyCode}</strong></span>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating account...' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-folio-muted mt-6">
            Already have an account? <Link to="/login" className="text-folio-green font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
