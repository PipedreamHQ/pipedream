const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-delete-milestone",
  name: "Delete Milestone",
  description: "Delete milestone in a repository.",
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
    milestone: {
      propDefinition: [
        github,
        "milestone",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
      description: "The number of the milestone to delete.",
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () => octokit.issues.deleteMilestone({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        milestone_number: this.milestone,
      }),
    );
    return result.data;
  },
};
