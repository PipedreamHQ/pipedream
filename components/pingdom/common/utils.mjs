export const removeHttp = (url) => {
  return url.replace(/^https?:\/\//, "");
};
