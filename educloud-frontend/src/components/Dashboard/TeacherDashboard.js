import React, { useState, useEffect } from 'react';
import { getTeacherCourses, createNewCourse } from '../../utils/api';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getTeacherCourses();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const createdCourse = await createNewCourse(newCourse);
      setCourses([...courses, createdCourse]);
      setNewCourse({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <h3>Your Courses</h3>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <a href={`/course/${course.id}`}>{course.title}</a>
          </li>
        ))}
      </ul>
      <h3>Create a New Course</h3>
      <form onSubmit={handleCreateCourse}>
        <input
          type="text"
          placeholder="Course Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Course Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          required
        />
        <button type="submit">Create Course</button>
      </form>
    </div>
  );
};

export default TeacherDashboard;
