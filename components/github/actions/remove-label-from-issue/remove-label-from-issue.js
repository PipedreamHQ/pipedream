const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-remove-label-from-issue",
  name: "Remove Label from Issue",
  description: "Remove Label from an issue.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    repoFullName: {
      propDefinition: [
        github,
        "repoFullName",
      ],
      description: "The Github issue where the label will be removed from.",
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
    label: {
      propDefinition: [
        github,
        "labelNames",
        (c) => ({
          repoFullName: c.repoFullName,
          issueNumber: c.issue,
        }),
      ],
      type: "string",
      description: "The label to remove.",
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () => octokit.request("DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}", {
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        issue_number: this.issue,
        name: this.label,
      }),
    );
    return result.data;
  },
};
