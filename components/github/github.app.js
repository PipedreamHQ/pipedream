const axios = require("axios");
const WEBHOOKS = require("@octokit/webhooks-definitions");
const listOfEvents = WEBHOOKS.map((webhook) => webhook.name);

module.exports = {
  type: "app",
  app: "github",
  propDefinitions: {
    repoFullName: {
      type: "string",
      label: "Repo",
      description: "The name of your repository (for example, `PipedreamHQ/pipedream`)",
      async options({ page }) {
        const repos = await this.getRepos({
          page: page + 1, // pipedream page 0-indexed, github is 1
        });
        return repos.map((repo) => repo.full_name);
      },
    },
    org: {
      type: "string",
      label: "Organization",
      description: "The name of your organization (the `PipedreamHQ` in `PipedreamHQ/pipedream`)",
      async options({ page }) {
        const orgs = await this.getOrgs({
          page: page + 1, // pipedream page 0-indexed, github is 1
        });
        return orgs.map((org) => org.login);
      },
      optional: true,
    },
    branch: {
      type: "string",
      label: "Branch",
      description: "The name of your branch",
      async options({
        page, repoFullName,
      }) {
        const branches = await this.getBranches({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        });
        return branches.map((branch) => branch.name);
      },
      optional: true,
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "The types of events you'd like to listen for. [See the GitHub docs](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads) for details on each.",
      options: listOfEvents,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Labels attached to issues or PRs",
      async options({
        page, repoFullName,
      }) {
        const labels = await this.getLabels({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        });
        return labels.map((label) => {
          return {
            label: label.name,
            value: label.id,
          };
        });
      },
    },
    labelNames: {
      type: "string[]",
      label: "Labels",
      description: "Labels attached to issues or PRs",
      async options({
        page, repoFullName,
      }) {
        const labels = await this.getLabels({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        });
        return labels.map((label) => {
          return label.name;
        });
      },
    },
    milestone: {
      type: "string",
      label: "Milestone",
      description: "[See the GitHub docs](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones)",
      async options({
        page, repoFullName,
      }) {
        const milestones = await this.getMilestones({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        });
        return milestones.map((milestone) => {
          return {
            label: milestone.title,
            value: milestone.id,
          };
        });
      },
    },
    order: {
      label: "Result order",
      type: "string",
      optional: true,
      description: "Order of returned results",
      options: [
        {
          label: "Descending",
          value: "desc",
        },
        {
          label: "Ascending",
          value: "asc",
        },
      ],
      default: "desc",
    },
    per_page: {
      label: "Results per page",
      type: "integer",
      description: "The number of results to return per page (max `100`)",
      optional: true,
      default: 100,
    },
    page: {
      label: "Page number",
      type: "integer",
      description: "Page number of the results to fetch",
      optional: true,
    },
    paginate: {
      type: "boolean",
      label: "Auto-Paginate",
      description: "By default, retrieve all matching search results across all result pages. Set to `false` to limit results to the first page.",
      optional: true,
      default: true,
    },
    q: {
      type: "string",
      label: "Keywords",
      description: "Enter one or more search keywords and qualifiers. Qualifiers allow you to limit your search to specific areas of GitHub (this field supports the same qualifiers as search on GitHub.com). To learn more about the format of the query, see [Constructing a search query](https://docs.github.com/rest/reference/search#constructing-a-search-query). See [Searching code](https://help.github.com/articles/searching-code/) for a detailed list of qualifiers.",
    },
    q_issues_and_pull_requests: {
      type: "string",
      label: "Keywords",
      description: "Enter one or more search keywords and qualifiers. Qualifiers allow you to limit your search to specific areas of GitHub (this field supports the same qualifiers as search on GitHub.com). To learn more about the format of the query, see [Constructing a search query](https://docs.github.com/rest/reference/search#constructing-a-search-query). See [Searching issues and pull requests](https://help.github.com/articles/searching-issues-and-pull-requests/) for a detailed list of qualifiers.",
    },
    sortIssues: {
      type: "string",
      label: "Sort",
      description: "Default is `Best Match`.",
      optional: true,
      options: [
        {
          label: "Best Match (default)",
          value: "",
        },
        "created",
        "updated",
        "comments",
        "reactions",
        "reactions-+1",
        "reactions--1",
        "reactions-smile",
        "reactions-thinking_face",
        "reactions-heart",
        "reactions-tada",
        "interactions",
      ],
      default: "",
    },
    issueAssignees: {
      type: "string[]",
      label: "Assignees",
      description: "Optionally enter Github usernames to assign to this issue. Add one username per row or pass an array of usernames in `{{...}}` as a custom expression. NOTE: Only users with push access can set assignees for new issues. Assignees are silently dropped otherwise.",
      optional: true,
    },
    issueBody: {
      type: "string",
      label: "Body",
      description: "Optionally add details describing the issue (this field supports [Github markdown](https://docs.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax)).",
      optional: true,
    },
    issueTitle: {
      type: "string",
      label: "Title",
      description: "The title of the issue.",
    },
  },
  methods: {
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers.authorization = `token ${this.$auth.oauth_access_token}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://api.github.com${path[0] === "/"
        ? ""
        : "/"}${path}`;
      return await axios(opts);
    },
    async generateSecret() {
      return "" + Math.random();
    },
    async getBranches(opts) {
      const {
        page,
        repoFullName,
      } = opts;
      return (
        await this._makeRequest({
          path: `/repos/${repoFullName}/branches`,
          params: {
            per_page: 100,
            page,
          },
        })
      ).data;
    },
    async getCommits(opts) {
      const {
        repoFullName,
        sha,
        page,
      } = opts;
      return (
        await this._makeRequest({
          path: `/repos/${repoFullName}/commits`,
          params: {
            per_page: 100,
            sha,
            page,
          },
        })
      ).data;
    },
    async getLabels(opts) {
      const {
        repoFullName,
        page,
      } = opts;
      return (
        await this._makeRequest({
          path: `/repos/${repoFullName}/labels`,
          params: {
            per_page: 100,
            page,
          },
        })
      ).data;
    },
    async getMilestones(opts) {
      const {
        repoFullName,
        page,
      } = opts;
      return (await this._makeRequest({
        path: `/repos/${repoFullName}/milestones`,
        params: {
          per_page: 100,
          page,
        },
      })).data;
    },
    async getReleases(opts) {
      const {
        repoFullName,
        ifModifiedSince,
      } = opts;
      const config = {
        path: `/repos/${repoFullName}/tags`,
        params: {
          per_page: 100,
        },
      };
      if (ifModifiedSince) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers["If-Modified-Since"] = ifModifiedSince;
      }
      return await this._makeRequest(config);
    },
    async getOrgs(opts = {}) {
      const { page } = opts;
      return (
        await this._makeRequest({
          path: "/user/orgs",
          params: {
            per_page: 100,
            page,
          },
        })
      ).data;
    },
    async getRepos(opts = {}) {
      const { org } = opts;
      delete opts.org;
      return (
        await this._makeRequest({
          path: org
            ? `/orgs/${org}/repos`
            : "/user/repos",
          params: {
            ...opts,
            per_page: 100,
          },
        })
      ).data;
    },
    async getTeams(opts = {}) {
      const { page } = opts;
      return (
        await this._makeRequest({
          path: "/user/teams",
          params: {
            per_page: 100,
            page,
          },
        })
      ).data;
    },
    async getUser() {
      return (
        await this._makeRequest({
          path: "/user",
        })
      ).data;
    },
    async getNotifications(opts = {}) {
      const {
        all = true,
        participating = false,
        since,
        before,
        page,
      } = opts;

      return (
        await this._makeRequest({
          path: "/notifications",
          params: {
            per_page: 100,
            page,
            all,
            participating,
            since,
            before,
          },
        })
      ).data;
    },
    async getWatchers(opts = {}) {
      const {
        repoFullName,
        page,
      } = opts;
      return (
        await this._makeRequest({
          path: `/repos/${repoFullName}/subscribers`,
          params: {
            per_page: 100,
            page,
          },
        })
      ).data;
    },
    async getGists(opts = {}) {
      const {
        since,
        page,
      } = opts;
      return (
        await this._makeRequest({
          path: "/gists",
          params: {
            since,
            per_page: 100,
            page,
          },
        })
      ).data;
    },
    async getUrl(opts = {}) {
      const { url } = opts;

      return (
        await this._makeRequest({
          path: url.replace("https://api.github.com", ""),
        })
      ).data;
    },
    async createHook({
      repoFullName, endpoint, events, secret,
    }) {
      return (
        await this._makeRequest({
          method: "post",
          path: `/repos/${repoFullName}/hooks`,
          data: {
            name: "web",
            config: {
              url: endpoint,
              content_type: "json",
              secret,
            },
            events,
          },
        })
      ).data;
    },
    async deleteHook({
      repoFullName, hookId,
    }) {
      return (
        await this._makeRequest({
          method: "delete",
          path: `/repos/${repoFullName}/hooks/${hookId}`,
        })
      ).data;
    },
  },
};
