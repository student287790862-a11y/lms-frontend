import React, { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
      showError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId, courseTitle) => {
    setEnrolling(courseId);
    try {
      await courseService.enrollInCourse(courseId);
      showSuccess(`Successfully enrolled in "${courseTitle}"!`);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to enroll in course';
      showError(errorMessage);
    } finally {
      setEnrolling(null);
    }
  };

  const getDifficultyLevel = (duration) => {
    if (duration <= 20) return { level: 'Beginner', color: 'success' };
    if (duration <= 35) return { level: 'Intermediate', color: 'warning' };
    return { level: 'Advanced', color: 'error' };
  };

  const filteredAndSortedCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterBy === 'all') return matchesSearch;
      
      const difficulty = getDifficultyLevel(course.duration_hours);
      return matchesSearch && difficulty.level.toLowerCase() === filterBy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'instructor':
          return a.instructor.localeCompare(b.instructor);
        case 'duration':
          return (a.duration_hours || 0) - (b.duration_hours || 0);
        case 'difficulty':
          const diffA = getDifficultyLevel(a.duration_hours || 0);
          const diffB = getDifficultyLevel(b.duration_hours || 0);
          const order = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return order[diffA.level] - order[diffB.level];
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="courses-page">
        <div className="container">
          <LoadingSpinner size="large" text="Loading courses..." fullScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              <span className="title-icon">📚</span>
              Course Catalog
            </h1>
            <p className="page-subtitle">
              Discover and enroll in our comprehensive collection of courses
            </p>
          </div>
          <div className="course-stats">
            <div className="stat">
              <span className="stat-number">{courses.length}</span>
              <span className="stat-label">Total Courses</span>
            </div>
            <div className="stat">
              <span className="stat-number">{filteredAndSortedCourses.length}</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="controls-section">
          <div className="search-box">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="filter">Filter by Level:</label>
              <select
                id="filter"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="title">Course Title</option>
                <option value="instructor">Instructor</option>
                <option value="duration">Duration</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        <div className="courses-grid">
          {filteredAndSortedCourses.length === 0 ? (
            <div className="no-courses">
              <div className="no-courses-icon">📭</div>
              <h3>No courses found</h3>
              <p>
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No courses are available at the moment.'
                }
              </p>
              {(searchTerm || filterBy !== 'all') && (
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBy('all');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            filteredAndSortedCourses.map((course) => {
              const difficulty = getDifficultyLevel(course.duration_hours || 0);
              return (
                <div key={course.id} className="course-card animate-fade-in">
                  <div className="course-header">
                    <div className="course-badges">
                      <span className={`badge badge-${difficulty.color}`}>
                        {difficulty.level}
                      </span>
                      {course.duration_hours && (
                        <span className="badge badge-secondary">
                          {course.duration_hours}h
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    
                    <div className="course-instructor">
                      <span className="instructor-name">Instructor: {course.instructor}</span>
                    </div>
                    
                    <div className="course-description">
                      {course.description || 'No description available.'}
                    </div>
                    
                    <div className="course-meta">
                      <div className="meta-item">
                        <span>Duration: {course.duration_hours ? `${course.duration_hours} hours` : 'Self-paced'}</span>
                      </div>
                      <div className="meta-item">
                        <span>Level: {difficulty.level}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="course-actions">
                    <button
                      className="btn btn-primary w-full"
                      onClick={() => handleEnroll(course.id, course.title)}
                      disabled={enrolling === course.id}
                    >
                      {enrolling === course.id ? (
                        <LoadingSpinner size="small" text="Enrolling..." />
                      ) : (
                        'Enroll Now'
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;