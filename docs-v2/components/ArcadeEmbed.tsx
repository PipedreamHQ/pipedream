import React from "react";

interface ArcadeEmbedProps {
  src: string;
  title?: string;
}

const ArcadeEmbed: React.FC<ArcadeEmbedProps> = ({
  src, title,
}) => {
  return (
    <div className="relative pb-[calc(56.25%+41px)] h-0 w-full">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        className="absolute top-0 left-0 w-full h-full"
        style={{
          colorScheme: "light",
        }} // Tailwind doesn't support color-scheme directly
      ></iframe>
    </div>
  );
};

export default ArcadeEmbed;
