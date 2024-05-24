import React from "react";

const ArcadeEmbed = ({
  src, title,
}) => {
  const embedUrl = `${src}`;

  return (
    <div style={{
      position: "relative",
      paddingBottom: "calc(56.25% + 41px)",
      height: 0,
      width: "100%",
    }}>
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          colorScheme: "light",
        }}
      ></iframe>
    </div>
  );
};

export default ArcadeEmbed;
