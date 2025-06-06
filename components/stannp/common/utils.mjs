import urlExists from "url-exist";
import { getFileStream } from "@pipedream/platform";

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

export const checkFile = async (url) => {
  if (await urlExists(url)) {
    return url;
  } else {
    return getFileStream(url);
  }
};
