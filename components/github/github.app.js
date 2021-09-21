const axios = require("axios");
const WEBHOOKS = require("@octokit/webhooks-definitions");
const listOfEvents = WEBHOOKS.map((webhook) => webhook.name);
const get = require("lodash/get");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "github",
  propDefinitions: {
    authorDate: {
      type: "string",
      label: "Author Date",
      description: "The created or updated date of the file. Default: Current date in UTC.",
      default: "",
      optional: true,
    },
    authorEmail: {
      type: "string",
      label: "Author Email",
      description: "The email of the file author.",
      optional: true,
    },
    authorName: {
      type: "string",
      label: "Author Name",
      description: "The author name of the file. If not specified, the autheticated user's name will be used.",
      optional: true,
    },
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
    commitDate: {
      type: "string",
      label: "Commit Date",
      description: "Specify a commit date. Default: Current date in UTC.",
      default: "",
      optional: true,
    },
    commitMessage: {
      type: "string",
      label: "Message",
      description: "The commit message.",
    },
    committerName: {
      type: "string",
      label: "Committer Name",
      description: "The person name that committed the file. If not specified, the autheticated user's name will be used.",
      optional: true,
    },
    committerEmail: {
      type: "string",
      label: "Committer Email",
      description: "The email of the person who committed the file.",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "The gist file content.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the milestone.",
    },
    discussionCategoryName: {
      type: "string",
      label: "Discussion Category Name",
      description: "If specified, a discussion of the specified category is created and linked to the release. For more information, see [Managing categories for discussions in your repository](https://docs.github.com/discussions/managing-discussions-for-your-community/managing-categories-for-discussions-in-your-repository).",
      optional: true,
    },
    draft: {
      type: "boolean",
      label: "Draft",
      description: "Indicates whether the pull request is a draft. See [Draft Pull Requests](https://help.github.com/en/articles/about-pull-requests#draft-pull-requests) in the GitHub Help documentation to learn more.",
      optional: true,
      default: false,
    },
    dueOn: {
      type: "string",
      label: "Due On",
      description: "The milestone due date. This is a timestamp in [ISO 8601(https://en.wikipedia.org/wiki/ISO_8601) format: YYYY-MM-DDTHH:MM:SSZ.",
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
    gist: {
      type: "string",
      label: "Gist",
      description: "ID of the gist to delete. Gists listed are for the connected user.",
      async options({ page }) {
        const gists = await this.getGists({
          page: page + 1, // pipedream page 0-indexed, github is 1
        });
        return gists.map((gist) => {
          return {
            label: gist.description,
            value: gist.id,
          };
        });
      },
    },
    gistFilename: {
      type: "string",
      label: "Name",
      description: "The name of the gist file to update. To append a new file to the gist, use unestructured mode and enter a filename not included in the list. Double quotes in the filename are transformed into single quotes.",
      async options(opts) {
        const { gist } = opts;
        const gistObj = await this.getGist({
          gist,
        });
        return  Object.keys(gistObj.files)
          .map( (key) => {
            return gistObj.files[key].filename;
          });
      },
      optional: true,
      default: "",
    },
    contentFile: {
      type: "string",
      label: "File",
      description: "The file to update.",
      async options({
        repoFullName, ref, path,
      }) {
        const contents = await this.getContentFiles({
          repoFullName,
          ref,
          path,
        });
        return contents.filter( (p) => { return p.type === "file"; })
          .map( (file) => {
            return {
              label: file.name,
              value: `${file.name}-${file.sha}`,
            };
          });
      },
    },
    labelNames: {
      type: "string[]",
      label: "Labels",
      description: "Labels attached to issues or PRs",
      async options({
        page, repoFullName, issueNumber,
      }) {
        const labels = await this.getLabels({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
          issueNumber,
        });
        return labels.map((label) => {
          return label.name;
        });
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the release.",
      optional: true,
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
            value: milestone.number,
          };
        });
      },
    },
    contentPath: {
      type: "string",
      label: "Path",
      description: "Path to the content within the repository.",
      async options({
        repoFullName, ref, type,
      }) {
        return await this.getContentPaths({
          repoFullName,
          ref,
          type,
        });
      },
    },
    prerelease: {
      type: "boolean",
      label: "Prerelease",
      description: "By default, `false` to identify the release as a full release. Set to`true` to identify the release as a prerelease",
      optional: true,
      default: false,
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
    pullRequest: {
      type: "string",
      label: "Pull Request",
      description: "Pull Request to update.",
      async options({
        page, repoFullName,
      }) {
        const pullRequests = await this.getPullRequests({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        });
        return pullRequests.map((pullRequest) => {
          return {
            label: pullRequest.title,
            value: pullRequest.number,
          };
        });
      },
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
    release: {
      type: "string",
      label: "Release",
      description: "The release to update.",
      async options({
        page, repoFullName,
      }) {
        const releases = await this.getReleases({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        });
        return releases.map((release) => {
          return {
            label: release.name,
            value: release.id,
          };
        });
      },
    },
    review: {
      type: "string",
      label: "Review",
      description: "The review to submit.",
      async options({
        page, repoFullName, pullNumber,
      }) {
        const reviews = await this.getReviews({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
          pullNumber,
        });
        return reviews.map((review) => {
          return {
            label: review.body,
            value: review.id,
          };
        });
      },
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
    issue: {
      type: "string",
      label: "Issue",
      description: "The Github issue. GitHub issues are used to track ideas, feedback, tasks, or bugs for work.",
      async options({
        page, repoFullName,
      }) {
        const issues = await this.getRepositoryIssues({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        });
        return issues.map((issue) =>  {
          return {
            label: issue.title,
            value: issue.number,
          };
        });
      },
    },
    issueAssignees: {
      type: "string[]",
      label: "Assignees",
      description: "Optionally enter Github usernames to assign to this issue. Add one username per row or disable structured mode to pass an array of usernames in `{{...}}`. NOTE: Only users with push access can set assignees for new issues. Assignees are silently dropped otherwise.",
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
    releaseName: {
      type: "string",
      label: "Name",
      description: "The name of the release.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the issue. Either `open` or `closed`.",
      options: [
        "open",
        "closed",
      ],
      default: "open",
      optional: true,
    },
    since: {
      type: "string",
      label: "Since",
      description: "Only show comments created after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: YYYY-MM-DDTHH:MM:SSZ.",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag Name",
      async options({
        page, repoFullName,
      }) {
        const tags = await this.getTags({
          page: page + 1, // pipedream page 0-indexed, github is 1
          repoFullName,
        });
        return tags.map((tag) => tag.name);
      },
      description: "The name of the tag.",
    },
    targetCommitish: {
      type: "string",
      label: "Target Commitish",
      description: "Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. Unused if the Git tag already exists.",
      default: "master",
      optional: true,
    },
    user: {
      type: "string",
      label: "User",
      description: "The Github user.",
      async options({ page }) {
        const users = await this.getUsers({
          page: page + 1, // pipedream page 0-indexed, github is 1
        });
        return users.map((user) =>  user.login);
      },
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
    _isRetriableStatusCode(statusCode) {
      [
        408,
        429,
        500,
      ].includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 3,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = [
            get(err, [
              "response",
              "status",
            ]),
          ];
          if (!this._isRetriableStatusCode(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err.message)}
            `);
          }
          console.warn(`Temporary error: ${err.message}`);
          throw err;
        }
      }, retryOpts);
    },
    async generateSecret() {
      return "" + Math.random();
    },
    async getRepositoryIssues(opts) {
      const {
        page,
        repoFullName,
      } = opts;
      return (
        await this._makeRequest({
          path: `/repos/${repoFullName}/issues`,
          params: {
            per_page: 100,
            page,
          },
        })
      ).data;
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
    async getContentFiles(opts) {
      const {
        repoFullName,
        ref,
        path,
      } = opts;
      const owner = repoFullName.split("/")[0];
      const repo = repoFullName.split("/")[1];
      const config = {
        path: `/repos/${owner}/${repo}/contents/${path}`,
        params: {
          ref,
        },
      };
      const contents = (await this._makeRequest(config)).data;
      return contents.filter( (p) => { return p.type === "file"; });
    },
    async getContentPaths(opts) {
      const {
        repoFullName,
        ref,
      } = opts;
      const allPaths = [];
      const self = this;
      const owner = repoFullName.split("/")[0];
      const repo = repoFullName.split("/")[1];
      async function GetPaths(currentPath) {
        const config = {
          path: `/repos/${owner}/${repo}/contents/${currentPath}`,
          params: {
            ref,
          },
        };
        const contents = (await self._makeRequest(config)).data;
        const paths = contents.filter( (p) => { return p.type === "dir"; })
          .map( (folder) => { return folder.path; } );
        if ( !paths.length ) {
          return;
        } else {
          for (const path of paths) {
            allPaths.push(path);
            await GetPaths(path);
          }
        }
      }
      await GetPaths("");
      return allPaths;
    },
    async getGist(opts) {
      const { gist } = opts;
      return (
        await this._makeRequest({
          path: `/gists/${gist}`,
        })
      ).data;
    },
    async getLabels(opts) {
      const {
        page,
        repoFullName,
        issueNumber,
      } = opts;
      const path = issueNumber ?
        `/repos/${repoFullName}/issues/${issueNumber}/labels` :
        `/repos/${repoFullName}/labels`;
      return (
        await this._makeRequest({
          path,
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
    async getPullRequests(opts) {
      const {
        repoFullName,
        page,
      } = opts;
      return (
        await this._makeRequest({
          path: `/repos/${repoFullName}/pulls`,
          params: {
            per_page: 100,
            page,
          },
        })
      ).data;
    },
    async getReleases(opts) {
      const {
        repoFullName,
        page,
      } = opts;
      const config = {
        path: `/repos/${repoFullName}/releases`,
        params: {
          per_page: 100,
          page,
        },
      };
      return (await this._makeRequest(config)).data;
    },
    async getReviews(opts) {
      const {
        page,
        repoFullName,
        pullNumber,
      } = opts;
      const config = {
        path: `/repos/${repoFullName}/pulls/${pullNumber}/reviews`,
        params: {
          per_page: 100,
          page,
        },
      };
      return (await this._makeRequest(config)).data;
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
    async getTags(opts) {
      const {
        page,
        repoFullName,
      } = opts;
      return (
        await this._makeRequest({
          path: `/repos/${repoFullName}/tags`,
          params: {
            per_page: 100,
            page,
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
    async getUsers(opts = {}) {
      const { page } = opts;
      return (
        await this._makeRequest({
          path: "/users",
          params: {
            per_page: 100,
            page,
          },
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
