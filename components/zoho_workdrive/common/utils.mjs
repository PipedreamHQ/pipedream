export const getFilePath = (filename) => {
  if (filename.indexOf("/tmp") === -1) {
    return `/tmp/${filename}`;
  }
  return filename;
};
