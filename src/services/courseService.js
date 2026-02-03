import api from './api';

export const courseService = {
  getCourses: async () => {
    const response = await api.get('/api/courses/');
    return response;
  },

  getCourse: async (courseId) => {
    const response = await api.get(`/api/courses/${courseId}`);
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post('/api/enrollments/', { course_id: courseId });
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/api/enrollments/my-enrollments');
    return response.data;
  },

  unenrollFromCourse: async (enrollmentId) => {
    const response = await api.delete(`/api/enrollments/${enrollmentId}`);
    return response.data;
  },

  // Admin functions
  createCourse: async (courseData) => {
    const response = await api.post('/api/courses/', courseData);
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/api/courses/${courseId}`, courseData);
    return response.data;
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete(`/api/courses/${courseId}`);
    return response.data;
  }
};