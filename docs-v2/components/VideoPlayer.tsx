import React from "react";

const VideoPlayer = ({
  src, title, startAt,
}) => {
  const embedUrl = `${src}?rel=0${startAt
    ? `&start=${startAt}`
    : ""}`;

  return (
    <div className="lg:mt-8 lg:px-16">
      <iframe
        className="mx-auto aspect-video w-full"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
