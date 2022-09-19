export default {
  getOwnerAndRepo(repoFullname) {
    const splited = repoFullname.split("/");

    return {
      owner: splited[0],
      repo: splited[0],
    };
  },
};
