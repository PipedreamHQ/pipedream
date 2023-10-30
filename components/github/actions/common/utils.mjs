export default {
  getOwnerAndRepo(repoFullname) {
    const splited = repoFullname.split("/");

    return {
      owner: splited[0],
      repo: splited[0],
    };
  },
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
