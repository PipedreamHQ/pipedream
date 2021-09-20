const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-list-issue-comments",
  name: "List Issue Comments",
  description: "List comments in the specicied issue.",
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
    since: {
      propDefinition: [
        github,
        "since",
      ],
    },
    paginate: {
      propDefinition: [
        github,
        "paginate",
      ],
      description: "By default, retrieve all the comments in the issue. Set to `false` to limit to the first page only.",
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    if (this.paginate) {
      return await this.github._withRetries(
        () => octokit.paginate(octokit.issues.listComments, {
          owner: this.repoFullName.split("/")[0],
          repo: this.repoFullName.split("/")[1],
          issue_number: this.issue,
          since: this.since,
          per_page: 100,
        }),
      );
    } else {
      const result = await this.github._withRetries(
        () => octokit.issues.listComments({
          owner: this.repoFullName.split("/")[0],
          repo: this.repoFullName.split("/")[1],
          issue_number: this.issue,
          since: this.since,
          per_page: 100,
        }),
      );
      return result.data;
    }
  },
};
