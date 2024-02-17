import React from 'react';

const VideoPlayer = ({ src, title, startAt }) => {
  const embedUrl = `${src}${startAt ? `?start=${startAt}` : ""}`;

  return (
    <iframe
      className="mt-8 mx-auto aspect-video w-full"
      src={embedUrl}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

export default VideoPlayer;
