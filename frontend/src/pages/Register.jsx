import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'player' });
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
      const data = await apiRequest('/auth/register', { method: 'POST', body: form });
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
      <h2>Create an account</h2>
      {error && <p style={{ color: 'tomato' }}>{error}</p>}
      <input name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required minLength={6} />
      <select name="role" value={form.role} onChange={onChange}>
        <option value="player">I am a player</option>
        <option value="owner">I own a venue</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  );
}
