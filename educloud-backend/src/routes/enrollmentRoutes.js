const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const enrollmentController = require('../controllers/enrollmentController');

// All routes require authentication
router.use(protect);

// Student enrollment routes
router.post('/', enrollmentController.enrollInCourse);
router.delete('/:courseId', enrollmentController.unenrollFromCourse);
router.get('/', enrollmentController.getUserEnrollments);
router.get('/:courseId', enrollmentController.getEnrollmentDetails);

// Progress tracking
router.put('/:courseId/progress', enrollmentController.updateProgress);
router.get('/:courseId/progress', enrollmentController.getProgress);
router.post('/:courseId/complete-lesson/:lessonId', enrollmentController.completeLesson);

// Instructor routes (requires instructor role)
router.use(authorize(['instructor', 'admin']));
router.get('/course/:courseId/students', enrollmentController.getCourseStudents);
router.get('/course/:courseId/progress', enrollmentController.getCourseProgress);
router.put('/course/:courseId/student/:studentId', enrollmentController.updateStudentProgress);

module.exports = router;
