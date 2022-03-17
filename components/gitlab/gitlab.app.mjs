import { Gitlab } from "@gitbeaker/node";
import constants from "./common/constants.mjs";
import axios from "axios";
import parseLinkHeader from "parse-link-header";
import { v4 } from "uuid";

export default {
  type: "app",
  app: "gitlab",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The project ID, as displayed in the main project page",
      async options({ prevContext }) {
        const response = await this.listProjects({
          owned: true,
          page: prevContext.nextPage,
        });
        return {
          options: response.data.map((project) => ({
            label: project.pathWithNamespace,
            value: project.id,
          })),
          context: {
            nextPage: response.paginationInfo.next,
          },
        };
      },
    },
    branch: {
      type: "string",
      label: "Branch Name",
      description: "The name of the branch",
      async options({
        prevContext, projectId,
      }) {
        const response = await this.listBranches(projectId, {
          page: prevContext.nextPage,
        });
        return {
          options: response.data.map((branch) => branch.name),
          context: {
            nextPage: response.paginationInfo.next,
          },
        };
      },
    },
    issueIid: {
      type: "string",
      label: "Issue Internal ID",
      description: "The internal ID of a project's issue ",
      async options({
        prevContext, projectId,
      }) {
        const response = await this.listIssues({
          projectId,
          scope: constants.issues.scopes.ALL,
          page: prevContext.nextPage,
        });
        return {
          options: response.data.map((issue) => ({
            label: issue.title,
            value: issue.iid,
          })),
          context: {
            nextPage: response.paginationInfo.next,
          },
        };
      },
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Comma-separated label names for the issue",
      optional: true,
      async options({
        prevContext, projectId,
      }) {
        const response = await this.listLabels(projectId, {
          page: prevContext.nextPage,
        });
        return {
          options: response.data.map((label) => label.name),
          context: {
            nextPage: response.paginationInfo.next,
          },
        };
      },
    },
    assignee: {
      type: "string",
      label: "Assignee Username",
      description: "Return issues assigned to the given username",
      optional: true,
      async options({
        prevContext, projectId,
      }) {
        const response = await this.listProjectMembers(projectId, {
          page: prevContext.nextPage,
        });
        return {
          options: response.data.map((member) => ({
            label: member.username,
            value: member.id,
          })),
          context: {
            nextPage: response.paginationInfo.next,
          },
        };
      },
    },
    issueState: {
      type: "string",
      label: "Issue State",
      description: "Return `all` issues or just those that are `opened` or `closed`",
      optional: true,
      options: Object.values(constants.issues.states),
      default: constants.issues.states.ALL,
    },
    stateEvent: {
      type: "string",
      label: "State Event",
      description: "The state event of an issue. Set close to close the issue and reopen to reopen it",
      optional: true,
      options: Object.values(constants.issues.stateEvents),
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description",
      optional: true,
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "Search Query",
      default: "",
    },
    max: {
      type: "integer",
      label: "Max Results",
      description: "Max number of results to return. Default value is `100`",
      optional: true,
      default: 100,
    },
  },
  methods: {
    _gitlabClient(opts = {}) {
      const { oauth_access_token: oauthToken } = this.$auth;
      return new Gitlab({
        oauthToken,
        camelize: true,
        ...opts,
      });
    },
    _commonOpts() {
      return {
        maxPages: 1,
        perPage: 100,
        showExpanded: true,
      };
    },
    _apiUrl() {
      return "https://gitlab.com/api/v4";
    },
    _userProjectsEndpoint() {
      const baseUrl = this._apiUrl();
      const userId = this._gitlabUserId();
      return `${baseUrl}/users/${userId}/projects`;
    },
    _projectCommitsEndpoint(projectId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/projects/${projectId}/repository/commits`;
    },
    _projectMilestonesEndpoint(projectId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/projects/${projectId}/milestones`;
    },
    _hooksEndpointUrl(projectId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/projects/${projectId}/hooks`;
    },
    _gitlabAuthToken() {
      return this.$auth.oauth_access_token;
    },
    _gitlabUserId() {
      return this.$auth.oauth_uid;
    },
    _makeRequestConfig() {
      const gitlabAuthToken = this._gitlabAuthToken();
      const headers = {
        "Authorization": `Bearer ${gitlabAuthToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    _generateToken: v4,
    isValidSource(headers, db) {
      const token = headers["x-gitlab-token"];
      const expectedToken = db.get("token");
      return token === expectedToken;
    },
    async *getCommits(opts) {
      const {
        projectId,
        branchName,
      } = opts;

      // Nothing to do here if the amount of commits we wish
      // to retrieve is not greater than 0.
      let { totalCommitsCount } = opts;
      if (totalCommitsCount <= 0) return;

      let url = this._projectCommitsEndpoint(projectId);
      const baseRequestConfig = this._makeRequestConfig();

      do {
        // Prepare the parameters for the Gitlab API call.
        const resultsPerPage = Math.min(50, totalCommitsCount);
        const params = {
          ref_name: branchName,
          per_page: resultsPerPage,
        };
        const requestConfig = {
          ...baseRequestConfig,
          params,
        };

        // Yield the retrieved commits in a serial manner, until
        // we exhaust the response from the Gitlab API, or we reach
        // the total amount of commits that are relevant for this case,
        // whichever comes first.
        const {
          data,
          headers,
        } = await axios.get(url,
          requestConfig);
        for (const commit of data) {
          yield commit;
          --totalCommitsCount;
          if (totalCommitsCount === 0) return;
        }

        // Extract the URL of the next page, if any.
        const { next } = parseLinkHeader(headers.link);
        url = next
          ? next.url
          : null;
      } while (url);
    },
    async *getMilestones(opts) {
      const {
        projectId,
        lastProcessedMilestoneId = -1,
        pageSize = 10,
      } = opts;

      let url = this._projectMilestonesEndpoint(projectId);

      // Prepare the parameters for the Gitlab API call.
      const baseRequestConfig = this._makeRequestConfig();
      const params = {
        per_page: pageSize,
      };
      const requestConfig = {
        ...baseRequestConfig,
        params,
      };

      do {
        // Yield the retrieved milestones in a serial manner, until
        // we exhaust the response from the Gitlab API, or we reach
        // the last processed milestone from the previous run,
        // whichever comes first.
        const {
          data,
          headers,
        } = await axios.get(url,
          requestConfig);
        for (const milestone of data) {
          if (milestone.id === lastProcessedMilestoneId) return;
          yield milestone;
        }

        // Extract the URL of the next page, if any.
        const { next } = parseLinkHeader(headers.link);
        url = next
          ? next.url
          : null;
      } while (url);
    },
    async *getProjects(opts) {
      const {
        lastProcessedProjectId = -1,
        pageSize = 10,
      } = opts;

      let url = this._userProjectsEndpoint();

      // Prepare the parameters for the Gitlab API call.
      const baseRequestConfig = this._makeRequestConfig();
      const params = {
        per_page: pageSize,
        owned: true,
      };
      const requestConfig = {
        ...baseRequestConfig,
        params,
      };

      do {
        // Yield the retrieved projects in a serial manner, until
        // we exhaust the response from the Gitlab API, or we reach
        // the last processed project from the previous run,
        // whichever comes first.
        const {
          data,
          headers,
        } = await axios.get(url,
          requestConfig);
        for (const project of data) {
          if (project.id === lastProcessedProjectId) return;
          yield project;
        }

        // Extract the URL of the next page, if any.
        const { next } = parseLinkHeader(headers.link);
        url = next
          ? next.url
          : null;
      } while (url);
    },
    async createHook(opts) {
      const {
        projectId,
        hookParams,
      } = opts;
      const url = this._hooksEndpointUrl(projectId);

      const token = this._generateToken();
      const data = {
        ...hookParams,
        token,
      };

      const requestConfig = this._makeRequestConfig();
      const response = await axios.post(url, data, requestConfig);
      const hookId = response.data.id;
      return {
        hookId,
        token,
      };
    },
    deleteHook(opts) {
      const {
        hookId,
        projectId,
      } = opts;
      const baseUrl = this._hooksEndpointUrl(projectId);
      const url = `${baseUrl}/${hookId}`;
      const requestConfig = this._makeRequestConfig();
      return axios.delete(url, requestConfig);
    },
    async listProjects(opts = {}) {
      return this.listAll(this._gitlabClient().Projects, null, opts);
    },
    async listProjectMembers(projectId, opts = {}) {
      return this.listAll(this._gitlabClient().ProjectMembers, projectId, opts);
    },
    async getBranch(projectId, branchName) {
      return this._gitlabClient().Branches.show(projectId, branchName);
    },
    async createBranch(projectId, branchName, ref) {
      return this._gitlabClient().Branches.create(projectId, branchName, ref);
    },
    async listBranches(projectId, opts = {}) {
      return this.listAll(this._gitlabClient().Branches, projectId, opts);
    },
    async listLabels(projectId, opts = {}) {
      return this.listAll(this._gitlabClient().Labels, projectId, opts);
    },
    async getIssue(projectId, issueIid) {
      return this._gitlabClient().Issues.show(projectId, issueIid);
    },
    async createIssue(projectId, opts) {
      return this._gitlabClient().Issues.create(projectId, opts);
    },
    async editIssue(projectId, issueIid, opts) {
      return this._gitlabClient().Issues.edit(projectId, issueIid, opts);
    },
    async listIssues(opts = {}) {
      return this.listAll(this._gitlabClient().Issues, null, opts);
    },
    async searchIssues(opts = {}) {
      return this.search(this._gitlabClient().Issues, opts);
    },
    async listCommits(opts = {}) {
      return this.search(this._gitlabClient().Commits, opts);
    },
    async search(client, opts = {}) {
      const { projectId } = opts;
      const data = this.pagination(
        client,
        projectId,
        opts,
      );
      const { max } = opts;
      const results = [];
      for await (const d of data) {
        results.push(d);
        if (max && results.length >= max) {
          results.length = max;
          break;
        }
      }
      return results;
    },
    async *pagination(api, projectId, opts) {
      while (true) {
        const response = await this.listAll(api, projectId, opts);

        for (const data of response.data) {
          yield data;
        }

        const {
          current,
          next,
          totalPages,
        } = response.paginationInfo;

        if (current === totalPages || !next) {
          break;
        }

        opts.page = next;
      }
    },
    async listAll(api, projectId = null, opts = {}) {
      const params = {
        ...this._commonOpts(),
        ...opts,
      };
      if (projectId) {
        return api.all(projectId, params);
      }
      return api.all(params);
    },
  },
};
