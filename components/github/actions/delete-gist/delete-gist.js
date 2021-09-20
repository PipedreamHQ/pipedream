const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-delete-gist",
  name: "Delete Gist",
  description: "Delete gist in connected Github account.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    gist: {
      propDefinition: [
        github,
        "gist",
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () => octokit.gists.delete({
        gist_id: this.gist,
      }),
    );
    return result.data;
  },
};
