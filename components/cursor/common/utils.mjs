import { getFileStream } from "@pipedream/platform";
import sizeOf from "image-size";

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

async function formatImages(images) {
  if (!images) return;
  const formattedImages = [];
  for (const image of images) {
    const stream = await getFileStream(image);
    const buffer = await streamToBuffer(stream);
    const base64 = buffer.toString("base64");
    const {
      width, height,
    } = sizeOf(buffer);
    formattedImages.push({
      data: base64,
      dimension: {
        width,
        height,
      },
    });
  }
  return formattedImages;
}

export {
  formatImages,
};
