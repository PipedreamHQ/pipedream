const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-delete-branch",
  name: "Delete Branch",
  description: "Deletes a branch from a Github repo.",
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
    branch: {
      propDefinition: [
        github,
        "branch",
        (c) => (
          {
            repoFullName: c.repoFullName,
          }
        ),
      ],
      description:
        "The branch to delete.",
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () =>  octokit.request("DELETE /repos/{owner}/{repo}/git/refs/{ref}", {
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        ref: `heads/${this.branch}`,
      }),
    );
    return result.data;
  },
};
