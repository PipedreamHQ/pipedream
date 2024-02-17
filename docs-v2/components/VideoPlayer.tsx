import React from 'react';
import styles from './VideoPlayer.module.css';

const VideoPlayer = ({ src, title, startAt }) => {
  const embedUrl = `${src}${startAt ? `?start=${startAt}` : ""}`;

  return (
    <iframe
      className={styles.video}
      src={src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

export default VideoPlayer;
