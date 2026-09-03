import { axios } from "@pipedream/platform";
import { v4 } from "uuid";
import constants from "./common/constants.mjs";
import { projectPath } from "./common/utils.mjs";

export default {
  type: "app",
  app: "gitlab",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The project ID, as displayed in the main project page",
      async options({ page }) {
        const response = await this.listProjects({
          params: {
            owned: true,
            page: page + 1,
          },
        });
        return response.map((project) => ({
          label: project.path_with_namespace,
          value: project.id,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "Select a Group or use a custom Group ID. You must be an Owner of this group",
      async options({ page }) {
        const response = await this.listGroups({
          params: {
            min_access_level: 50, // owner role
            top_level_only: true, // only can use on root groups
            page: page + 1,
          },
        });
        return response.map((group) => ({
          label: group.full_path,
          value: group.id,
        }));
      },
    },
    groupPath: {
      type: "string",
      label: "Group Path",
      description: "Select a Group or use a custom Group Path, as displayed in the main group page. You must be an Owner of this group",
      async options({ page }) {
        const response = await this.listGroups({
          params: {
            min_access_level: 50, // owner role
            top_level_only: true, // only can use on root groups
            page: page + 1,
          },
        });
        return response.map((group) => ({
          label: group.full_path,
          value: group.path,
        }));
      },
    },
    branch: {
      type: "string",
      label: "Branch Name",
      description: "The name of the branch",
      async options({
        page, projectId,
      }) {
        const response = await this.listBranches(projectId, {
          params: {
            page: page + 1,
          },
        });
        return response.map((branch) => branch.name);
      },
    },
    issueIid: {
      type: "string",
      label: "Issue Internal ID",
      description: "The internal ID of a project's issue ",
      async options({
        page, projectId,
      }) {
        const response = await this.listIssues(projectId, {
          params: {
            scope: constants.issues.scopes.ALL,
            page: page + 1,
          },
        });
        return response.map((issue) => ({
          label: issue.title,
          value: issue.iid,
        }));
      },
    },
    epicIid: {
      type: "string",
      label: "Epic Internal ID",
      description: "The internal ID of a project's epic. [This feature is restricted to Gitlab's Premium and Ultimate tiers.](https://docs.gitlab.com/ee/api/epics.html)",
      async options({
        page, groupId,
      }) {
        const response = await this.listEpics(
          groupId,
          {
            params: {
              page: page + 1,
            },
          },
        );
        return response.map((epic) => ({
          label: epic.title,
          value: epic.iid,
        }));
      },
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Comma-separated label names for the issue",
      optional: true,
      async options({
        page, projectId,
      }) {
        const response = await this.listLabels(projectId, {
          params: {
            page: page + 1,
          },
        });
        return response.map((label) => label.name);
      },
    },
    groupLabels: {
      type: "string[]",
      label: "Labels",
      description: "The comma-separated list of labels",
      optional: true,
      async options({
        page, groupId,
      }) {
        const response = await this.listGroupLabels(groupId, {
          params: {
            page: page + 1,
          },
        });
        return response?.map?.((label) => label.name);
      },
    },
    assignee: {
      type: "string",
      label: "Assignee Username",
      description: "Return issues assigned to the given username",
      optional: true,
      async options({
        page, projectId,
      }) {
        const response = await this.listProjectMembers(projectId, {
          params: {
            page: page + 1,
          },
        });
        return response.map((member) => ({
          label: member.username,
          value: member.id,
        }));
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
    color: {
      type: "string",
      label: "Color",
      description: "The color of the epic. Introduced in GitLab 14.8, behind a feature flag named `epic_highlight_color` (disabled by default)",
      optional: true,
    },
    confidential: {
      type: "boolean",
      label: "Confidential",
      description: "Whether the epic should be confidential",
      optional: true,
    },
    created_at: {
      type: "string",
      label: "Created at",
      description: "When the epic was created. Date time string, ISO 8601 formatted, for example `2016-03-11T03:45:40Z` . Requires administrator or project/group owner privileges (available in GitLab 13.5 and later)",
      optional: true,
    },
    updated_at: {
      type: "string",
      label: "Updated at",
      description: "When the epic was updated. Date time string, ISO 8601 formatted, for example `2016-03-11T03:45:40Z` . Requires administrator or project/group owner privileges (available in GitLab 13.5 and later)",
      optional: true,
    },
    start_date_is_fixed: {
      type: "boolean",
      label: "Start Date Is Fixed",
      description: "Whether start date should be sourced from start_date_fixed or from milestones (in GitLab 11.3 and later)",
      optional: true,
    },
    due_date_is_fixed: {
      type: "boolean",
      label: "Due Date Is Fixed",
      description: "Whether due date should be sourced from due_date_fixed or from milestones (in GitLab 11.3 and later)",
      optional: true,
    },
    projectIdStatic: {
      type: "string",
      label: "Project",
      description: "The project, given either as its path — `group/project` or `group/subgroup/project`, e.g. `backend/payments` — or as its numeric project ID. The path is what appears in the project URL and is usually what a user will name, so prefer it. A pasted GitLab URL also works. Use **List Projects** to find the path if you only know part of the name.",
    },
    groupIdStatic: {
      type: "string",
      label: "Group",
      description: "The group, given either as its full path (e.g. `backend` or `backend/platform`) or as its numeric group ID. Use **List Groups** to look it up.",
    },
    mergeRequestIid: {
      type: "integer",
      label: "Merge Request IID",
      description: "The merge request's **internal** ID — the `!N` shown in the GitLab UI and the number at the end of the merge request URL. This is *not* the `id` field, which is a much larger instance-wide number; passing `id` here returns a 404. Use **List Merge Requests** or **Search Merge Requests** to resolve the IID from a title, branch or author.",
    },
    discussionId: {
      type: "string",
      label: "Discussion ID",
      description: "The ID of a merge request thread — a 40-character hex string. Use **List Merge Request Discussions** to find it.",
    },
    mergeRequestState: {
      type: "string",
      label: "State",
      description: "Return merge requests in this state. Defaults to `opened`, which is what \"open MRs\" means. Use `merged` for MRs that have already landed and `all` to ignore state entirely.",
      options: Object.values(constants.mergeRequests.states),
      default: constants.mergeRequests.states.OPENED,
      optional: true,
    },
    mergeRequestScope: {
      type: "string",
      label: "Scope",
      description: "Narrow the results by the authenticated user's relationship to the merge request. `reviews_for_me` answers \"what is waiting on my review?\", `assigned_to_me` \"what is assigned to me?\", and `created_by_me` \"what did I open?\". Defaults to `all`.",
      options: Object.values(constants.mergeRequests.scopes),
      optional: true,
    },
    mergeRequestOrderBy: {
      type: "string",
      label: "Order By",
      description: "Field to order results by. Defaults to `created_at`.",
      options: Object.values(constants.mergeRequests.orderBy),
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort",
      description: "Sort direction. Defaults to `desc` (newest first).",
      options: Object.values(constants.mergeRequests.sort),
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of records to return **in total**, paginating as needed. Defaults to `100`. GitLab caps a single page at 100, so higher values mean multiple requests — keep it modest unless you need the whole list.",
      min: 1,
      default: constants.DEFAULT_MAX_RESULTS,
      optional: true,
    },
    detail: {
      type: "string",
      label: "Detail",
      description: "How much of each record to return. `summary` (the default) returns the fields needed to identify and triage a merge request and is much cheaper to read. Use `full` only when you need a field the summary omits.",
      options: Object.values(constants.mergeRequests.detail),
      default: constants.mergeRequests.detail.SUMMARY,
      optional: true,
    },
  },
  methods: {
    _generateToken: v4,
    _getBaseApiUrl() {
      return this.$auth.base_api_url ?? "gitlab.com";
    },
    _baseUrl() {
      return `https://${this._getBaseApiUrl()}/api/v4`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _userId() {
      return this.$auth.oauth_uid;
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    async createProjectHook(projectId, opts = {}) {
      const token = this._generateToken();
      const { id: hookId } = await this._makeRequest({
        path: `/projects/${projectId}/hooks`,
        method: "POST",
        data: {
          ...opts.data,
          token,
        },
      });
      return {
        hookId,
        token,
      };
    },
    deleteProjectHook(projectId, hookId) {
      return this._makeRequest({
        path: `/projects/${projectId}/hooks/${hookId}`,
        method: "DELETE",
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    listProjectMembers(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/members`,
        ...opts,
      });
    },
    listMilestones(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/milestones`,
        ...opts,
      });
    },
    getBranch(projectId, branchName) {
      return this._makeRequest({
        path: `/projects/${projectId}/repository/branches/${branchName}`,
      });
    },
    createBranch(projectId, branchName, ref) {
      return this._makeRequest({
        path: `/projects/${projectId}/repository/branches`,
        method: "POST",
        data: {
          branch: branchName,
          ref,
        },
      });
    },
    listBranches(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/repository/branches`,
        ...opts,
      });
    },
    listLabels(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/labels`,
        ...opts,
      });
    },
    listGroupLabels(groupId, opts = {}) {
      return this._makeRequest({
        path: `/groups/${groupId}/labels`,
        ...opts,
      });
    },
    getIssue(projectId, issueIid) {
      return this._makeRequest({
        path: `/projects/${projectId}/issues/${issueIid}`,
      });
    },
    createIssue(projectId, opts) {
      return this._makeRequest({
        path: `/projects/${projectId}/issues`,
        method: "POST",
        ...opts,
      });
    },
    createEpic(groupId, opts) {
      return this._makeRequest({
        path: `/groups/${groupId}/epics`,
        method: "POST",
        ...opts,
      });
    },
    updateEpic(groupId, epicIid, opts) {
      return this._makeRequest({
        path: `/groups/${groupId}/epics/${epicIid}`,
        method: "PUT",
        ...opts,
      });
    },
    editIssue(projectId, issueIid, opts) {
      return this._makeRequest({
        path: `/projects/${projectId}/issues/${issueIid}`,
        method: "PUT",
        ...opts,
      });
    },
    listIssues(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/issues`,
        ...opts,
      });
    },
    searchIssues(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/issues`,
        ...opts,
      });
    },
    listEpics(groupId, opts = {}) {
      return this._makeRequest({
        path: `/groups/${groupId}/epics`,
        ...opts,
      });
    },
    listCommits(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/repository/commits`,
        ...opts,
      });
    },
    listMergeRequests(opts = {}) {
      return this._makeRequest({
        path: "/merge_requests",
        ...opts,
      });
    },
    listProjectMergeRequests(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests`,
        ...opts,
      });
    },
    listGroupMergeRequests(groupId, opts = {}) {
      // Groups accept the same numeric-ID-or-encoded-path form as projects.
      return this._makeRequest({
        path: `/groups/${projectPath(groupId)}/merge_requests`,
        ...opts,
      });
    },
    getMergeRequest(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}`,
        ...opts,
      });
    },
    listMergeRequestDiffs(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/diffs`,
        ...opts,
      });
    },
    listMergeRequestCommits(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/commits`,
        ...opts,
      });
    },
    getMergeRequestApprovals(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/approvals`,
        ...opts,
      });
    },
    listMergeRequestPipelines(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/pipelines`,
        ...opts,
      });
    },
    listMergeRequestDiscussions(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/discussions`,
        ...opts,
      });
    },
    searchProjectUsers(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/users`,
        ...opts,
      });
    },
    createMergeRequest(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests`,
        method: "POST",
        ...opts,
      });
    },
    createMergeRequestNote(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/notes`,
        method: "POST",
        ...opts,
      });
    },
    createMergeRequestDiscussion(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/discussions`,
        method: "POST",
        ...opts,
      });
    },
    createMergeRequestDiscussionNote(projectId, mergeRequestIid, discussionId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/discussions/${discussionId}/notes`,
        method: "POST",
        ...opts,
      });
    },
    updateMergeRequestDiscussion(projectId, mergeRequestIid, discussionId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/discussions/${discussionId}`,
        method: "PUT",
        ...opts,
      });
    },
    approveMergeRequest(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/approve`,
        method: "POST",
        ...opts,
      });
    },
    unapproveMergeRequest(projectId, mergeRequestIid, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectPath(projectId)}/merge_requests/${mergeRequestIid}/unapprove`,
        method: "POST",
        ...opts,
      });
    },
  },
};
