const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const { handleAsync } = require('../utils/errorHandler');

// Enroll in a course
exports.enrollInCourse = handleAsync(async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId
    });

    if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        enrollmentDate: Date.now(),
        status: 'active'
    });

    await enrollment.populate('course', 'title description');
    res.status(201).json({ enrollment });
});

// Unenroll from a course
exports.unenrollFromCourse = handleAsync(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOneAndDelete({
        student: studentId,
        course: courseId
    });

    if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ message: 'Successfully unenrolled from course' });
});

// Get user's enrollments
exports.getUserEnrollments = handleAsync(async (req, res) => {
    const enrollments = await Enrollment.find({ student: req.user._id })
        .populate('course', 'title description instructor')
        .populate('completedLessons', 'title');
    res.json({ enrollments });
});

// Get enrollment details
exports.getEnrollmentDetails = handleAsync(async (req, res) => {
    const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.courseId
    })
    .populate('course', 'title description instructor')
    .populate('completedLessons', 'title');

    if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ enrollment });
});

// Update progress
exports.updateProgress = handleAsync(async (req, res) => {
    const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.courseId
    });

    if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.progress = req.body.progress;
    enrollment.lastAccessedAt = Date.now();
    await enrollment.save();

    res.json({ enrollment });
});

// Get progress
exports.getProgress = handleAsync(async (req, res) => {
    const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.courseId
    })
    .populate('completedLessons', 'title');

    if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ progress: enrollment.progress, completedLessons: enrollment.completedLessons });
});

// Complete a lesson
exports.completeLesson = handleAsync(async (req, res) => {
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId
    });

    if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Add lesson to completed lessons if not already completed
    if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
        enrollment.lastAccessedAt = Date.now();
        await enrollment.save();
    }

    res.json({ message: 'Lesson marked as complete' });
});

// Get course students (instructor only)
exports.getCourseStudents = handleAsync(async (req, res) => {
    const { courseId } = req.params;

    // Verify instructor owns the course
    const course = await Course.findOne({
        _id: courseId,
        instructor: req.user._id
    });

    if (!course && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this course\'s students' });
    }

    const enrollments = await Enrollment.find({ course: courseId })
        .populate('student', 'name email')
        .populate('completedLessons', 'title');

    res.json({ enrollments });
});

// Get course progress (instructor only)
exports.getCourseProgress = handleAsync(async (req, res) => {
    const { courseId } = req.params;

    // Verify instructor owns the course
    const course = await Course.findOne({
        _id: courseId,
        instructor: req.user._id
    });

    if (!course && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this course\'s progress' });
    }

    const enrollments = await Enrollment.find({ course: courseId })
        .populate('student', 'name email')
        .populate('completedLessons', 'title');

    res.json({ enrollments });
});

// Update student progress (instructor only)
exports.updateStudentProgress = handleAsync(async (req, res) => {
    const { courseId, studentId } = req.params;
    const { progress } = req.body;

    // Verify instructor owns the course
    const course = await Course.findOne({
        _id: courseId,
        instructor: req.user._id
    });

    if (!course && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this course\'s progress' });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
        { course: courseId, student: studentId },
        { progress },
        { new: true }
    );

    if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ enrollment });
});
