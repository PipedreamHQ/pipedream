const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-add-labels-to-issue",
  name: "Add Label(s) to Issue",
  description: "Adds Label(s) to Issue.",
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
      description: "The Github issue where the label(s) will be added.",
    },
    labels: {
      propDefinition: [
        github,
        "labelNames",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
      optional: true,
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () => octokit.issues.addLabels({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        issue_number: this.issue,
        labels: this.labels,
      }),
    );
    return result.data;
  },
};
