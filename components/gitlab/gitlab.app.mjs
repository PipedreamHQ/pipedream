import { Gitlab } from "@gitbeaker/node";
import constants from "./common/constants.mjs";
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
    groupPath: {
      type: "string",
      label: "Group ID",
      description: "The group path, as displayed in the main group page. You must be an Owner of this group",
      async options({ prevContext }) {
        const response = await this.listGroups({
          min_access_level: 50, // owner role
          top_level_only: true, // only can use on root groups
          page: prevContext.nextPage,
        });
        return {
          options: response.data.map((group) => ({
            label: group.fullPath,
            value: group.path,
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
    _generateToken: v4,
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
    async createProjectHook(projectId, url, opts = {}) {
      const token = this._generateToken();
      const { id: hookId } = await this._gitlabClient().ProjectHooks.add(projectId, url, {
        token,
        ...opts,
      });
      return {
        hookId,
        token,
      };
    },
    async deleteProjectHook(projectId, hookId) {
      return this._gitlabClient().ProjectHooks.remove(projectId, hookId);
    },
    async getUnprocessedProjects(lastProcessedProjectId) {
      const projects = this.pagination(this._gitlabClient().Projects, null, {
        owned: true,
      });
      return this.getUnprocessedObjects(lastProcessedProjectId, projects);
    },
    async getUnprocessedMilestones(projectId, lastProcessedMilestoneId) {
      const milestones = this.pagination(this._gitlabClient().ProjectMilestones, projectId);
      return this.getUnprocessedObjects(lastProcessedMilestoneId, milestones);
    },
    async getUnprocessedObjects(lastProcessedId, list) {
      const unprocessed = [];
      for await (const obj of list) {
        if (obj.id === lastProcessedId) break;
        unprocessed.push(obj);
      }
      return unprocessed;
    },
    async listProjects(opts = {}) {
      return this.listAll(this._gitlabClient().Projects, null, opts);
    },
    async listGroups(opts = {}) {
      return this.listAll(this._gitlabClient().Groups, null, opts);
    },
    async listProjectMembers(projectId, opts = {}) {
      return this.listAll(this._gitlabClient().ProjectMembers, projectId, opts);
    },
    async listMilestones(projectId, opts = {}) {
      return this.listAll(this._gitlabClient().ProjectMilestones, projectId, opts);
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
      /**
       * client.Issues.all({ projectId, ...opts });
       */
      return this.search(this._gitlabClient().Issues, null, opts);
    },
    async listCommits(projectId, opts = {}) {
      /**
       * client.Commits.all(projectId, { ...opts });
       */
      return this.search(this._gitlabClient().Commits, projectId, opts);
    },
    async search(client, projectId = null, opts = {}) {
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
    async *pagination(api, projectId = null, opts = {}) {
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
