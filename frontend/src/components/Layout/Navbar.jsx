import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiEdit, FiUser, FiLogOut, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileMenu(false);
    }
  };

  return (
    <nav className="navbar glass-strong">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✍️</span>
          <span className="logo-text gradient-text">BlogFlow</span>
        </Link>

        {/* Search bar — desktop */}
        <form className="navbar-search desktop-only" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="navbar-search"
          />
        </form>

        {/* Right section */}
        <div className="navbar-right">
          {/* Theme toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" id="theme-toggle-btn">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          {user ? (
            <>
              {/* Write button */}
              <Link to="/write" className="write-btn" id="write-btn">
                <FiEdit />
                <span>Write</span>
              </Link>

              {/* User dropdown */}
              <div className="user-menu">
                <button
                  className="user-avatar-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                  id="user-menu-btn"
                >
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showDropdown && (
                  <div className="dropdown-menu animate-fade-in">
                    <div className="dropdown-header">
                      <span className="dropdown-name">{user.name}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiUser /> My Profile
                    </Link>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link" id="nav-login-btn">Sign In</Link>
              <Link to="/register" className="nav-btn" id="nav-register-btn">Get Started</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            id="mobile-menu-btn"
          >
            {showMobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="mobile-menu animate-fade-in">
          <form className="navbar-search mobile-search" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}

      {/* Backdrop for dropdown */}
      {showDropdown && (
        <div className="dropdown-backdrop" onClick={() => setShowDropdown(false)} />
      )}
    </nav>
  );
};

export default Navbar;
