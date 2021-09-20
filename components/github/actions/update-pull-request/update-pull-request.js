const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-update-pull-request",
  name: "Update Pull Request",
  description: "Updates a pull request on a Github repo.",
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
    pullRequest: {
      propDefinition: [
        github,
        "pullRequest",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
    },
    title: {
      propDefinition: [
        github,
        "issueTitle",
      ],
      description: "The title of the pull request.",
      optional: true,
    },
    body: {
      propDefinition: [
        github,
        "issueBody",
      ],
      description: "The contents of the pull request.",
    },
    base: {
      propDefinition: [
        github,
        "branch",
        (c) => (
          {
            repoFullName: c.repoFullName,
          }
        ),
      ],
      label: "Base",
      description:
        "The name of the branch where changes are to be pulled into.",
    },
    state: {
      propDefinition: [
        github,
        "state",
      ],
      description: "State of the pull request. Either `open` or `closed`.",
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const opts = {
      owner: this.repoFullName.split("/")[0],
      repo: this.repoFullName.split("/")[1],
      pull_number: this.pullRequest,
      title: this.title,
    };
    if (this.body) {
      opts.body = this.body;
    }
    if (this.base) {
      opts.base = this.base;
    }
    if (this.state) {
      opts.state = this.state;
    }
    const result = await this.github._withRetries(
      () =>  octokit.pulls.update(opts),
    );
    return result.data;
  },
};
