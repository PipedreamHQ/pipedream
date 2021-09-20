const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-create-milestone",
  name: "Create Milestone",
  description: "Create milestone in a repo.",
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
    const result = await this.github._withRetries(
      () => octokit.issues.createMilestone({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        title: this.title,
        state: this.state,
        description: this.description,
        due_on: this.due_on,
      }),
    );
    return result.data;
  },
};
