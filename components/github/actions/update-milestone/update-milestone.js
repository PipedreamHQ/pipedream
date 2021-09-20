const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-update-milestone",
  name: "Update Milestone",
  description: "Update milestone in a repo.",
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
      description: "The number of the milestone to update.",
    },
    title: {
      propDefinition: [
        github,
        "issueTitle",
      ],
      description: "The title of the milestone.",
    },
    state: {
      propDefinition: [
        github,
        "state",
      ],
      description: "The state of the milestone. Either `open` or `closed`.",
    },
    description: {
      propDefinition: [
        github,
        "description",
      ],
    },
    dueOn: {
      propDefinition: [
        github,
        "dueOn",
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
      milestone_number: this.milestone,
    };
    if (this.title) {
      opts.title = this.title;
    }
    if (this.state) {
      opts.state = this.state;
    }
    if (this.description) {
      opts.description = this.description;
    }
    if (this.dueOn) {
      opts.due_on = this.dueOn;
    }
    const result = await this.github._withRetries(
      () => octokit.issues.updateMilestone(opts),
    );
    return result.data;
  },
};
