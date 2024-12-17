import React, { useEffect, useState } from 'react';
import { getStudentCourses } from '../../utils/api';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getStudentCourses();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <a href={`/course/${course.id}`}>{course.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDashboard;
