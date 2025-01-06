import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UnauthorizedPage from './components/Auth/UnauthorizedPage';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

// Protected Pages
import AdminDashboard from './components/Dashboard/AdminDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';

// Course Pages
import CourseList from './components/Courses/CourseList';
import CourseDetails from './pages/Courses/CourseDetails';
import CourseForm from './components/Courses/CourseForm';

// Live Class Pages
import LiveClass from './components/Live/LiveClass';
import LiveClassScheduler from './components/Live/LiveClassScheduler';

// Profile Pages
import Profile from './pages/Profile/Profile';
import Settings from './pages/Profile/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes - Admin Only */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* Add more admin routes here */}
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Teacher Only */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute roles={['teacher']}>
            <Routes>
              <Route path="/" element={<TeacherDashboard />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="courses/new" element={<CourseForm />} />
              <Route path="courses/:id/edit" element={<CourseForm isEditing />} />
              <Route path="schedule-class" element={<LiveClassScheduler />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Student Only */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={['student']}>
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<CourseList />} />
              <Route path="courses/:id" element={<CourseDetails />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - All Authenticated Users */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/live/:id"
        element={
          <ProtectedRoute>
            <LiveClass />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
