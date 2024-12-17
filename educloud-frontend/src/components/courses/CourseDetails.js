import React, { useEffect, useState } from 'react';
import { getCourseDetails } from '../../utils/api';
import VideoPlayer from '../Shared/VideoPlayer';

const CourseDetails = ({ id }) => {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getCourseDetails(id);
      setCourse(data);
    };
    fetchDetails();
  }, [id]);

  return (
    <div>
      {course ? (
        <>
          <h2>{course.title}</h2>
          <VideoPlayer videoUrl={course.videoUrl} />
          <p>{course.description}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CourseDetails;
