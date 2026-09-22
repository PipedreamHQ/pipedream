export default {
  convertFiles(files) {
    return Object.keys(files).reduce((acc, key) => {
      acc[key] = files[key]
        ? {
          content: files[key],
        }
        : null;
      return acc;
    }, {});
  },
};
