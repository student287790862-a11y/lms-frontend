import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with proven track records and real-world experience.',
      highlight: 'Professional Instructors'
    },
    {
      title: 'Progress Analytics',
      description: 'Track your learning journey with detailed analytics and performance insights.',
      highlight: 'Data-Driven Learning'
    },
    {
      title: 'Industry Certification',
      description: 'Earn recognized certificates that enhance your professional credentials.',
      highlight: 'Career Advancement'
    },
    {
      title: 'Flexible Learning',
      description: 'Study at your own pace with lifetime access to course materials and updates.',
      highlight: 'Self-Paced'
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-level security with encrypted data and secure authentication protocols.',
      highlight: 'Secure Platform'
    },
    {
      title: 'Mobile Optimized',
      description: 'Access your courses seamlessly across all devices with responsive design.',
      highlight: 'Cross-Platform'
    }
  ];

  const stats = [
    { number: '25,000+', label: 'Active Learners' },
    { number: '1,200+', label: 'Expert Courses' },
    { number: '150+', label: 'Industry Partners' },
    { number: '96%', label: 'Success Rate' }
  ];



  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">Enterprise Learning Platform</span>
            </div>
            <h1 className="hero-title">
              Advance Your Career 
              <span className="gradient-text"> Professional Learning</span>
            </h1>
            
            {user ? (
              <div className="hero-actions">
                <Link to="/courses" className="btn btn-primary btn-lg">
                  Continue Learning
                </Link>
                <Link to="/my-courses" className="btn btn-outline btn-lg">
                  View Progress
                </Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Start Learning Today
                </Link>
                <Link to="/courses" className="btn btn-outline btn-lg">
                  Explore Courses
                </Link>
              </div>
            )}

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Platform</h2>
            <p className="section-subtitle">
              Experience professional learning designed for career advancement and skill development
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-content">
                  <div className="feature-highlight">{feature.highlight}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="learning-path">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Your Learning Journey</h2>
            <p className="section-subtitle">
              A structured approach to professional development and skill mastery
            </p>
          </div>
          
          <div className="path-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Assess & Plan</h3>
                <p>Evaluate your current skills and create a personalized learning roadmap aligned with your career goals.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Learn & Apply</h3>
                <p>Engage with expert-led content, hands-on projects, and real-world case studies to build practical skills.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Certify & Advance</h3>
                <p>Earn industry-recognized certifications and leverage your new skills for career advancement opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>




    </div>
  );
};

export default Home;
