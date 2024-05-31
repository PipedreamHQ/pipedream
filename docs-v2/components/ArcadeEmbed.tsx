import React from "react";

interface ArcadeEmbedProps {
  src: string;
  title?: string;
}

const ArcadeEmbed: React.FC<ArcadeEmbedProps> = ({
  src, title,
}) => {
  return (
    <div style={{
      position: "relative",
      paddingBottom: "calc(56.25% + 41px)",
      height: 0,
      width: "100%",
    }}>
      <iframe
        src={src}
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
