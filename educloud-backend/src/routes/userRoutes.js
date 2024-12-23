const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const { uploadProfileImage } = require('../middlewares/upload');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Protected routes
router.use(protect); // All routes below this will require authentication

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', uploadProfileImage, userController.updateProfile);
router.put('/change-password', userController.changePassword);

// Course enrollment routes
router.get('/courses', userController.getEnrolledCourses);
router.get('/progress/:courseId', userController.getCourseProgress);

// Settings routes
router.put('/settings', userController.updateSettings);

// Admin only routes
router.use(authorize(['admin'])); // All routes below this require admin role
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
