const express = require('express');
const courseController = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, courseController.getTeacherCourses);
router.post('/', protect, courseController.createCourse);

module.exports = router;
