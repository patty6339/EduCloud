import React from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = React.useRef();

  React.useEffect(() => {
    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
    });

    player.src({ src: videoUrl, type: 'application/x-mpegURL' });

    return () => {
      player.dispose();
    };
  }, [videoUrl]);

  return (
    <div>
      <video ref={videoRef} className="video-js" />
    </div>
  );
};

export default VideoPlayer;
