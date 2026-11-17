import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: form });
      login(data.token, data.user);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem', maxWidth: 360, margin: '2rem auto', padding: '0 1rem' }}>
      <h2>Log in</h2>
      {error && <p style={{ color: 'tomato' }}>{error}</p>}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
      <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
      <p>No account yet? <Link to="/register">Register</Link></p>
    </form>
  );
}
