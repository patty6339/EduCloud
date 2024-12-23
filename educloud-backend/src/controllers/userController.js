const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { handleAsync, APIError } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Register new user
exports.register = handleAsync(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: role || 'student'
    });

    // Generate token
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(201).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Login user
exports.login = handleAsync(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Forgot password
exports.forgotPassword = handleAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        return res.status(404).json({ message: 'No user found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // In a real application, send email with reset token
    res.json({ message: 'Password reset token sent to email' });
});

// Reset password
exports.resetPassword = handleAsync(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
});

// Get user profile
exports.getProfile = handleAsync(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
});

// Update user profile
exports.updateProfile = handleAsync(async (req, res) => {
    const user = await User.findById(req.user._id);

    // Update fields
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    if (req.file) {
        user.profileImage = req.file.path;
    }

    const updatedUser = await user.save();
    res.json({ user: updatedUser });
});

// Change password
exports.changePassword = handleAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Check current password
    if (!(await user.comparePassword(currentPassword))) {
        return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
});

// Get enrolled courses
exports.getEnrolledCourses = handleAsync(async (req, res) => {
    const enrollments = await Enrollment.find({ student: req.user._id })
        .populate({
            path: 'course',
            select: 'title description instructor',
            populate: {
                path: 'instructor',
                select: 'name email'
            }
        });

    res.json({ enrollments });
});

// Get course progress
exports.getCourseProgress = handleAsync(async (req, res) => {
    const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.params.courseId
    }).populate('completedLessons');

    if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ progress: enrollment.progress });
});

// Update user settings
exports.updateSettings = handleAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.settings = { ...user.settings, ...req.body };
    await user.save();
    res.json({ settings: user.settings });
});

// Admin: Get all users
exports.getAllUsers = handleAsync(async (req, res) => {
    const users = await User.find().select('-password');
    res.json({ users });
});

// Admin: Get user by ID
exports.getUserById = handleAsync(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
});

// Admin: Update user
exports.updateUser = handleAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    Object.assign(user, req.body);
    const updatedUser = await user.save();
    res.json({ user: updatedUser });
});

// Admin: Delete user
exports.deleteUser = handleAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();
    res.json({ message: 'User deleted successfully' });
});
