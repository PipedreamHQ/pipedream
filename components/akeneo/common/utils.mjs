export default {
  checkTmp(filename) {
    if (!filename.startsWith("/tmp")) {
      return `/tmp/${filename}`;
    }
    return filename;
  },
};
