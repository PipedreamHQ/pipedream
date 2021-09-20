const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-update-issue",
  name: "Update Issue",
  description: "Update an issue in a Gihub repo.",
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
    title: {
      propDefinition: [
        github,
        "issueTitle",
      ],
    },
    body: {
      propDefinition: [
        github,
        "issueBody",
      ],
    },
    state: {
      propDefinition: [
        github,
        "state",
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
      optional: true,
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
    assignees: {
      propDefinition: [
        github,
        "issueAssignees",
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const opts = {
      owner: this.repoFullName.split("/")[0],
      repo: this.repoFullName.split("/")[1],
      issue_number: this.issue,
      title: this.title,
    };
    if (this.body) {
      opts.body = this.body;
    }
    if (this.state) {
      opts.state = this.state;
    }
    if (this.milestone) {
      opts.milestone = this.milestone;
    }
    if (this.labels) {
      opts.labels = this.labels;
    }
    if (this.assignees) {
      opts.assignees = this.assignees;
    }
    const result = await this.github._withRetries(
      () =>  octokit.issues.update(opts),
    );
    return result.data;
  },
};
