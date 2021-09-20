const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-delete-release",
  name: "Delete Release",
  description: "Delete release in a repo.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    repoFullName: {
      propDefinition: [
        github,
        "repoFullName",
      ],
    },
    release: {
      propDefinition: [
        github,
        "release",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () => octokit.repos.deleteRelease({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        release_id: this.release,
      }),
    );
    return result.data;
  },
};
