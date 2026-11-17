import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 id="project-name">PadelMatch</h1>
      <p>Book padel courts, find players and join matches.</p>
      <Link to="/register">Get started</Link>
    </div>
  );
}
