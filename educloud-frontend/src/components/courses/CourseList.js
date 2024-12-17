import React from 'react';

const CourseList = ({ courses }) => {
  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>
          <a href={`/course/${course.id}`}>{course.title}</a>
        </li>
      ))}
    </ul>
  );
};

export default CourseList;
