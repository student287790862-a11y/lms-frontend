import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { signup } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 3) return 'weak';
    if (score < 4) return 'medium';
    return 'strong';
  };

  const getPasswordRequirements = (password) => {
    return [
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'Contains number', met: /[0-9]/.test(password) },
      { text: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) }
    ];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setAgreedToTerms(checked);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });

      if (name === 'password') {
        setPasswordStrength(calculatePasswordStrength(value));
      }
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const result = await signup(signupData);
      
      if (result.success) {
        showSuccess('Account created successfully! Please check your email to verify your account.');
        navigate('/login', { 
          state: { message: 'Account created successfully! Please sign in to continue.' }
        });
      } else {
        setError(result.error);
        showError(result.error);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const requirements = getPasswordRequirements(formData.password);

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
      </div>
      
      <div className="container">
        <div className="auth-wrapper">
          <div className="auth-card signup-card">
            <div className="auth-header">
              <div className="auth-logo">
                <div className="logo-text">LMS Platform</div>
              </div>
              <h1>Create Your Account</h1>
              <p>Join thousands of professionals advancing their careers</p>
            </div>
            
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a unique username"
                      className={`form-input ${error && error.includes('username') ? 'error' : ''}`}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`form-input ${error && error.includes('email') ? 'error' : ''}`}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="full_name" className="form-label">
                  Full Name <span className="optional">(Optional)</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={`form-input ${error && error.includes('password') ? 'error' : ''}`}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={loading}
                  >
                  </button>
                </div>
                
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div className={`strength-fill strength-${passwordStrength}`}></div>
                    </div>
                    <div className={`strength-text strength-${passwordStrength}-text`}>
                      Password strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                    </div>
                  </div>
                )}
                
                {formData.password && (
                  <div className="password-requirements">
                    <h5>Password Requirements:</h5>
                    <div className="requirements-grid">
                      {requirements.map((req, index) => (
                        <div key={index} className={`requirement ${req.met ? 'met' : 'unmet'}`}>
                          <span className="req-icon">{req.met ? '✓' : '○'}</span>
                          <span className="req-text">{req.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`form-input ${error && error.includes('match') ? 'error' : ''}`}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    disabled={loading}
                  >
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className={`password-match ${formData.password === formData.confirmPassword ? 'match' : 'no-match'}`}>
                    <span className="match-icon">
                      {formData.password === formData.confirmPassword ? '✓' : '○'}
                    </span>
                    <span>
                      {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    I agree to the{' '}
                    <Link to="/terms" className="terms-link" target="_blank">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="terms-link" target="_blank">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary auth-btn"
                disabled={loading || !agreedToTerms}
              >
                {loading ? (
                  <LoadingSpinner size="small" text="Creating Account..." />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Side Panel */}
          <div className="auth-side-panel">
            <div className="panel-content">
              <h2>Why Join Us?</h2>
              <p>Transform your career with our comprehensive learning platform designed for professionals.</p>
              
              <div className="panel-benefits">
                <div className="benefit-item">
                  <div className="benefit-number">01</div>
                  <div className="benefit-content">
                    <h4>Expert-Led Courses</h4>
                    <p>Learn from industry professionals with real-world experience</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-number">02</div>
                  <div className="benefit-content">
                    <h4>Flexible Learning</h4>
                    <p>Study at your own pace with lifetime access to materials</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-number">03</div>
                  <div className="benefit-content">
                    <h4>Career Growth</h4>
                    <p>Earn certificates that boost your professional profile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;