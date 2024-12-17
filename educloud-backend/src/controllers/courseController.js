const Course = require('../models/courseModel');

exports.getTeacherCourses = async (req, res) => {
  const teacherId = req.user.id; // Assume `req.user` is populated by middleware
  const courses = await Course.findByTeacher(teacherId);
  res.status(200).json(courses);
};

exports.createCourse = async (req, res) => {
  const teacherId = req.user.id;
  const { title, description } = req.body;

  const course = await Course.create({ title, description, teacherId });
  res.status(201).json(course);
};
