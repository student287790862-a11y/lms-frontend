import React, { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import LoadingSpinner from '../components/LoadingSpinner';
import './MyCourses.css';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unenrolling, setUnenrolling] = useState(null);

  useEffect(() => {
    loadMyEnrollments();
  }, []);

  const loadMyEnrollments = async () => {
    try {
      const enrollmentsData = await courseService.getMyEnrollments();
      setEnrollments(enrollmentsData);
    } catch (err) {
      setError('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) {
      return;
    }

    setUnenrolling(enrollmentId);
    try {
      await courseService.unenrollFromCourse(enrollmentId);
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
      alert('Successfully unenrolled from course!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to unenroll from course');
    } finally {
      setUnenrolling(null);
    }
  };

  const getProgressPercentage = (enrollment) => {
    // Mock progress calculation - in real app this would come from backend
    return Math.floor(Math.random() * 100);
  };

  const getDifficultyLevel = (course) => {
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  if (loading) {
    return (
      <div className="my-courses-page">
        <div className="container">
          <div className="loading-container">
            <LoadingSpinner size="large" text="Loading your courses..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-courses-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">My Learning Dashboard</h1>
            <p className="page-subtitle">Track your progress and manage your enrolled courses</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-number">{enrollments.length}</div>
              <div className="stat-label">Enrolled Courses</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{enrollments.filter(e => e.completed_at).length}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{enrollments.length - enrollments.filter(e => e.completed_at).length}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {enrollments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <h3>No Courses Yet</h3>
              <p>Start your learning journey by enrolling in courses that match your interests and career goals.</p>
              <a href="/courses" className="btn btn-primary btn-lg">
                Explore Courses
              </a>
            </div>
          </div>
        ) : (
          <div className="courses-grid">
            {enrollments.map((enrollment) => {
              const progress = getProgressPercentage(enrollment);
              const difficulty = getDifficultyLevel(enrollment.course);
              
              return (
                <div key={enrollment.id} className="course-card">
                  <div className="course-header">
                    <div className="course-badge">
                      {enrollment.completed_at ? 'Completed' : 'In Progress'}
                    </div>
                    <div className="course-difficulty">
                      <span className={`difficulty-badge difficulty-${difficulty.toLowerCase()}`}>
                        {difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="course-content">
                    <h3 className="course-title">{enrollment.course.title}</h3>
                    
                    <div className="course-meta">
                      <div className="meta-item">
                        <span className="meta-label">Instructor:</span>
                        <span className="meta-value">{enrollment.course.instructor}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Duration:</span>
                        <span className="meta-value">
                          {enrollment.course.duration_hours ? 
                            `${enrollment.course.duration_hours} hours` : 'Self-paced'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="course-description">
                      {enrollment.course.description || 'No description available.'}
                    </div>
                    
                    <div className="progress-section">
                      <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-percentage">{progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="enrollment-info">
                      <div className="info-item">
                        <span className="info-label">Enrolled:</span>
                        <span className="info-value">
                          {new Date(enrollment.enrolled_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {enrollment.completed_at && (
                        <div className="info-item">
                          <span className="info-label">Completed:</span>
                          <span className="info-value">
                            {new Date(enrollment.completed_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="course-actions">
                    <button className="btn btn-primary btn-sm">
                      {enrollment.completed_at ? 'Review Course' : 'Continue Learning'}
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleUnenroll(enrollment.id)}
                      disabled={unenrolling === enrollment.id}
                    >
                      {unenrolling === enrollment.id ? (
                        <LoadingSpinner size="small" text="Unenrolling..." />
                      ) : (
                        'Unenroll'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;