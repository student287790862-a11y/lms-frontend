import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import CourseForm from '../components/CourseForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.is_admin) {
      return;
    }
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCourses(response.data);
    } catch (error) {
      setMessage('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      setMessage('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      setMessage('Error deleting course');
    }
  };

  const handleFormSubmit = async (courseData) => {
    try {
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, courseData);
        setMessage('Course updated successfully');
      } else {
        await courseService.createCourse(courseData);
        setMessage('Course created successfully');
      }
      setShowForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      setMessage('Error saving course');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  if (!user?.is_admin) {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button 
          className="btn btn-primary"
          onClick={handleCreateCourse}
        >
          Create New Course
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <CourseForm
              course={editingCourse}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      <div className="courses-management">
        <h2>Manage Courses</h2>
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3>{course.title}</h3>
                <div className="course-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleEditCourse(course)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="course-instructor">Instructor: {course.instructor}</p>
              <p className="course-duration">Duration: {course.duration_hours} hours</p>
              <p className="course-description">{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;