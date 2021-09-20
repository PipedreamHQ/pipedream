const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-get-issue",
  name: "Get Issue",
  description: "Get details for an issue including title, state, author user and more.",
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
    issue: {
      propDefinition: [
        github,
        "issue",
        (c) => (
          {
            repoFullName: c.repoFullName,
          }
        ),
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () => octokit.issues.get({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        issue_number: this.issue,
      }),
    );
    return result.data;
  },
};
