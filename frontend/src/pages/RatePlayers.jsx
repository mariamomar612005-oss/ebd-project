import { useEffect, useState } from 'react';
import { apiRequest } from '../api';

export default function RatePlayers() {
  const [players, setPlayers] = useState([]);
  const [received, setReceived] = useState([]);
  const [form, setForm] = useState({ targetUserId: '', rating: 0, scoreLogged: '', comment: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [p, r] = await Promise.all([
        apiRequest('/reviews/players'),
        apiRequest('/reviews/received'),
      ]);
      setPlayers(p);
      setReceived(r);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!form.targetUserId) return setError('Choose a player');
    if (!form.rating) return setError('Choose a star rating');
    setLoading(true);
    try {
      const data = await apiRequest('/reviews', { method: 'POST', body: form });
      const name = players.find((p) => p._id === form.targetUserId)?.name || 'The player';
      setMessage(`Saved! ${name}'s skill rating is now ${data.skillRating}.`);
      setForm({ targetUserId: '', rating: 0, scoreLogged: '', comment: '' });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const average = received.length
    ? (received.reduce((sum, r) => sum + r.rating, 0) / received.length).toFixed(1)
    : null;

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', padding: '0 1rem' }}>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <h2>Post-match score and rating</h2>
        {error && <p style={{ color: 'tomato' }}>{error}</p>}
        {message && <p style={{ color: 'lightgreen' }}>{message}</p>}

        <select
          value={form.targetUserId}
          onChange={(e) => setForm({ ...form, targetUserId: e.target.value })}
        >
          <option value="">Choose a player</option>
          {players.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} (skill {p.skillRating})
            </option>
          ))}
        </select>

        <div>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setForm({ ...form, rating: n })}
              aria-label={`${n} stars`}
              style={{ fontSize: '1.8rem', background: 'none', border: 'none', cursor: 'pointer', color: n <= form.rating ? 'gold' : 'gray' }}
            >
              ★
            </button>
          ))}
        </div>

        <input
          placeholder="Set scores, e.g. 6-4, 6-2"
          value={form.scoreLogged}
          onChange={(e) => setForm({ ...form, scoreLogged: e.target.value })}
        />
        <textarea
          placeholder="Comment (optional)"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Submit'}</button>
      </form>

      <h3 style={{ marginTop: '2rem' }}>
        Ratings you received{average ? ` (average ${average})` : ''}
      </h3>
      {received.length === 0 && <p>No ratings yet.</p>}
      {received.map((r) => (
        <div key={r._id} style={{ borderTop: '1px solid gray', padding: '0.5rem 0' }}>
          <strong>{r.reviewerId?.name || 'A player'}</strong>: {'★'.repeat(r.rating)}
          {r.scoreLogged && <span> · Score {r.scoreLogged}</span>}
          {r.comment && <p>{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}
