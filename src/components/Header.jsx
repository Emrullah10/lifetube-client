import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiSearch, FiVideo, FiUser, FiLogOut, FiMenu, FiPlay } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="btn-icon menu-btn" onClick={onMenuClick}>
          <FiMenu size={24} />
        </button>
        <Link to="/" className="logo">
          <FiVideo size={32} color="#ff0000" />
          <span>LifeTube</span>
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <FiSearch size={20} />
        </button>
      </form>

      <div className="header-right">
        {isAuthenticated ? (
          <>
            <Link to="/upload" className="btn-icon" title="Upload video">
              <FiVideo size={24} />
            </Link>
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img src={user?.avatar_url} alt={user?.username} />
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link
                    to={`/channel/${user?.id}`}
                    onClick={() => setShowUserMenu(false)}
                    className="dropdown-item"
                  >
                    <FiUser size={18} />
                    <span>Your Channel</span>
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <FiLogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">
            <FiUser size={18} />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
