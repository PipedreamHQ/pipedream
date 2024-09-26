import React from "react";
import Image from "next/image";

interface PipedreamImgProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const PipedreamImg = ({
  src, alt, width, height,
}: PipedreamImgProps) => {
  return (
    <div className="mt-4 mb-4">
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  );
};

export default PipedreamImg;
