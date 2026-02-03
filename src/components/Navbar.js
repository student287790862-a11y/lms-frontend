import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">LMS</div>
            <span>LMS Platform</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="navbar-links desktop-nav">
            {user ? (
              <>
                <Link 
                  to="/courses" 
                  className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
                >
                  Courses
                </Link>
                <Link 
                  to="/my-courses" 
                  className={`nav-link ${isActive('/my-courses') ? 'active' : ''}`}
                >
                  My Courses
                </Link>
                {user.is_admin && (
                  <Link 
                    to="/admin" 
                    className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="nav-user-menu">
                  <div className="nav-user">
                    <div className="user-avatar">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user.full_name || user.username}</span>
                      <span className="user-role">{user.is_admin ? 'Administrator' : 'Student'}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <div className="mobile-user-info">
                <div className="user-avatar large">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.full_name || user.username}</span>
                  <span className="user-role">{user.is_admin ? 'Administrator' : 'Student'}</span>
                </div>
              </div>
              <Link 
                to="/courses" 
                className={`mobile-nav-link ${isActive('/courses') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                to="/my-courses" 
                className={`mobile-nav-link ${isActive('/my-courses') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Courses
              </Link>
              {user.is_admin && (
                <Link 
                  to="/admin" 
                  className={`mobile-nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="mobile-nav-link logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`mobile-nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="mobile-nav-link primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;