const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-find-organization",
  name: "Find Organization",
  description: "Find a Github organization.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    q: {
      propDefinition: [
        github,
        "q_issues_and_pull_requests",
      ],
      label: "Organization",
      description: "The organization name to look for. It's what follows after `https://github.com/` in a org Github profile URL.",
    },
    sort: {
      propDefinition: [
        github,
        "sortIssues",
      ],
      options: [
        {
          label: "Best Match (default)",
          value: "",
        },
        "followers",
        "repositories",
        "joined",
      ],
    },
    order: {
      propDefinition: [
        github,
        "order",
      ],
    },
    paginate: {
      propDefinition: [
        github,
        "paginate",
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const q = `${this.q} type:org`;
    if (this.paginate) {
      return await this.github._withRetries(
        () => octokit.paginate(octokit.search.users, {
          q,
          sort: this.sort,
          order: this.order,
          per_page: 100,
        }),
      );
    } else {
      const result = await this.github._withRetries(
        () => octokit.search.users({
          q,
          sort: this.sort,
          order: this.order,
          per_page: 100,
        }),
      );
      return result.data.items;
    }
  },
};
