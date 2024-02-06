import { ConfigurationError } from "@pipedream/platform";
/* eslint-disable no-unused-vars */
export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      _,
      v,
    ]) => (v != null && v != ""))
    .reduce(
      (acc, [
        k,
        v,
      ]) => ({
        ...acc,
        [k]: (!Array.isArray(v) && v === Object(v))
          ? clearObj(v)
          : v,
      }),
      {},
    );
};

export const getUploadContentType = (filename) => {
  const fileExt = filename.split(".").pop();
  switch (fileExt.toLowerCase()) {
  case "png": return "image/png";
  case "jpg": return "image/jpeg";
  case "jpeg": return "image/jpeg";
  case "gif": return "image/gif";
  default: throw ConfigurationError("Only `.jpg`, `.jpeg`, `.png`, and `.gif` may be used at this time. Other file types are not supported.");
  }
};
