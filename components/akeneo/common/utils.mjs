export default {
  checkTmp(filename) {
    if (filename.indexOf("/tmp") != 0) {
      return `/tmp/${filename}`;
    }
    return filename;
  },
};
