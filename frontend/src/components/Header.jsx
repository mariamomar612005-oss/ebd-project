import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', flexWrap: 'wrap' }}>
      <Link to="/">PadelMatch</Link>
      <span style={{ flex: 1 }} />
      {user ? (
        <>
          <Link to="/home">Home</Link>
          <span>Hi, {user.name}</span>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </header>
  );
}
