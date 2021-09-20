const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-list-issue-comments-in-repository",
  name: "List Issue Comments in Repository",
  description: "List issue comments in the specicied repository.",
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
    sort: {
      propDefinition: [
        github,
        "sortIssues",
      ],
      description: "Default is `created`.",
      options: [
        "created",
        "updated",
      ],
    },
    direction: {
      type: "string",
      label: "Either `asc` or `desc`. Ignored without the sort parameter.",
      description: "Only show notifications updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: YYYY-MM-DDTHH:MM:SSZ.",
      options: [
        "asc",
        "desc",
      ],
      default: "asc",
      optional: true,
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
        () => octokit.paginate(octokit.issues.listCommentsForRepo, {
          owner: this.repoFullName.split("/")[0],
          repo: this.repoFullName.split("/")[1],
          sort: this.sort,
          direction: this.direction,
          since: this.since,
          per_page: 100,
        }),
      );
    } else {
      const result = await this.github._withRetries(
        () => octokit.issues.listCommentsForRepo({
          owner: this.repoFullName.split("/")[0],
          repo: this.repoFullName.split("/")[1],
          sort: this.sort,
          direction: this.direction,
          since: this.since,
          per_page: 100,
        }),
      );
      return result.data;
    }
  },
};
