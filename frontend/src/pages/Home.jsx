import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome, {user.name}</h2>
      <p>You are logged in as a {user.role}.</p>
    </div>
  );
}
