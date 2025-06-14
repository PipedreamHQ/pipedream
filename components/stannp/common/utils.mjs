import { getFileStreamAndMetadata } from "@pipedream/platform";

export const parseObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    return JSON.parse(obj);
  }
  return obj;
};

export const getFileData = async (file) => {
  const {
    stream, metadata,
  } = await getFileStreamAndMetadata(file);
  return {
    stream,
    metadata: {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    },
  };
};
