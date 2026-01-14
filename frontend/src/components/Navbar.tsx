import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav>
      <div className="container">
        <h1>My Portfolio</h1>
        <ul>
          <li>
            <Link to="/" className={isActive('/')}>Home</Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about')}>About Me</Link>
          </li>
          <li>
            <Link to="/resume" className={isActive('/resume')}>Resume</Link>
          </li>
          <li>
            <Link to="/carbuild" className={isActive('/carbuild')}>Car Build</Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          </li>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <li>
                  <Link to="/admin" className={isActive('/admin')}>Admin</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="secondary">Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className={isActive('/login')}>Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
