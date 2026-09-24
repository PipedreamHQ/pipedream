import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "asana",
  propDefinitions: {
    organizations: {
      label: "Organizations",
      description: "List of organizations. This field uses the organization GID (e.g. `1200123456789012`). Use **List Organizations Options** to find available organization GIDs.",
      type: "string[]",
    },
    workspaces: {
      label: "Workspaces",
      description: "List of workspaces. This field uses the workspace GID (e.g. `1200123456789012`). Use the **List Workspaces** action to retrieve available workspace GIDs.",
      type: "string[]",
    },
    teams: {
      label: "Teams",
      description: "List of teams. Use the **List Teams** action to retrieve available team GIDs.",
      type: "string[]",
    },
    projects: {
      label: "Projects",
      description: "List of projects. This field uses the project GID (e.g. `1204567890123456`). Use **Search Projects** to find available project GIDs (the `gid` field).",
      type: "string[]",
    },
    tags: {
      label: "Tags",
      description: "List of tags. This field uses the tag GID (e.g. `1202345678901234`). Use **List Tags** to find available tag GIDs (the `gid` field).",
      type: "string[]",
    },
    users: {
      label: "Users",
      description: "List of users. This field uses the user `gid` (e.g. `1198765432109876`). Use the **List Users** action to retrieve available user GIDs.",
      type: "string[]",
    },
    tasks: {
      label: "Tasks",
      description: "List of tasks. This field uses the task GID (e.g. `1202345678901234`). Use **Search Tasks** to find available task GIDs (the `gid` field). Requires a project GID from **Search Projects**.",
      type: "string[]",
    },
    sections: {
      label: "Sections",
      description: "List of sections. This field uses the section GID (e.g. `1203456789012345`). Use **Search Sections** to find available section GIDs (the `gid` field). Requires a project GID from **Search Projects**.",
      type: "string[]",
    },
    taskFields: {
      label: "Task Fields",
      description: "List of task fields that will emit events when updated (e.g. `assignee`, `due_on`, `completed`). Use **List Task Fields** to get the complete list of valid field names.",
      type: "string[]",
    },
    taskTemplate: {
      type: "string",
      label: "Task Template",
      description: "The GID of a task template, e.g. `1205678901234567`. Use **List Task Templates** to find available template GIDs (the `gid` field).",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum total number of results to return across all paginated API calls. Each page fetches up to 100 items (Asana's maximum); this cap is applied after auto-pagination completes.",
      default: 100,
      min: 1,
      max: 9999,
      optional: true,
    },
    optFields: {
      type: "string[]",
      label: "Opt Fields",
      description: "Optional properties to include in the response, as a list of field paths. Nested paths are allowed (e.g. `owner.name`, `custom_fields.name`); `gid` is always returned. [See the documentation](https://developers.asana.com/docs/inputoutput-options)",
      optional: true,
    },
    portfolioId: {
      type: "string",
      label: "Portfolio",
      description: "The portfolio GID. Use the **List Portfolios** action to find available portfolio GIDs.",
    },
  },
  methods: {
    /**
     * Get the access token;
     *
     * @returns {string} The access token.
     */
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    /**
     * Get the base url of Asana API;
     *
     * @returns {string} The Asana Api base url.
     */
    _apiUrl() {
      return "https://app.asana.com/api/1.0";
    },
    _headers() {
      return {
        Accept: "application/json",
        Authorization: `Bearer ${this._accessToken()}`,
      };
    },
    /**
     * Make a requests with pre defined options.
     *
     * @param {string} path - The path to make the request.
     * @param {object} opts - A default Axios options object.
     *
     * @returns {string} The request result data.
     */
    _makeRequest({
      path, $ = this, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._headers(),
        ...opts,
      };
      return axios($, config);
    },
    /**
     * Create a webhook
     *
     * @param {string} opts.data - The body that will be send on request.
     *
     * @returns {object} An Asana Webhook.
     */
    async createWebHook(opts = {}) {
      return this._makeRequest({
        path: "webhooks",
        method: "post",
        ...opts,
      });
    },
    /**
     * Remove a Webhook.
     *
     * @param {string} hookId - The Asana Webhook GID.
     */
    async deleteWebhook(hookId) {
      await this._makeRequest({
        path: `webhooks/${hookId}`,
        method: "delete",
      });
    },
    /**
     * Get an Asana Workspace.
     *
     * @param {string} workspaceId - The workspace GID.
     *
     * @returns {string} An Asana Workspace.
     */
    getWorkspace({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}`,
        ...opts,
      });
    },
    /**
     * Get an Asana Workspace list.
     *
     * @returns {string} An Asana Workspace object list.
     */
    getWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "workspaces",
        ...opts,
      });
    },
    /**
     * Get an Asana Organizations list.
     *
     * @returns {string} An Asana Organizations list.
     */
    async getOrganizations({ $ } = {}) {
      const params = {
        opt_fields: "is_organization,name",
      };
      const workspaces = [];
      do {
        const {
          data, next_page: next,
        } = await this.getWorkspaces({
          params,
          $,
        });
        workspaces.push(...data);
        params.offset = next?.offset;
      } while (params.offset);

      return workspaces.filter((workspace) => workspace.is_organization);
    },
    /**
     * Get an Asana Project.
     *
     * @param {string} projectId - The project GID.
     *
     * @returns {string} An Asana Project.
     */
    getProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `projects/${projectId}`,
        ...opts,
      });
    },
    /**
     * Get an Asana Project list.
     *
     * @returns {string} An Asana Project list.
     */
    getProjects(opts = {}) {
      return this._makeRequest({
        path: "projects",
        ...opts,
      });
    },
    /**
     * Get an Asana Portfolio.
     *
     * @param {string} portfolioId - The portfolio GID.
     *
     * @returns {string} An Asana Portfolio.
     */
    getPortfolio({
      portfolioId, ...opts
    }) {
      return this._makeRequest({
        path: `portfolios/${portfolioId}`,
        ...opts,
      });
    },
    /**
     * Get an Asana Portfolio list.
     *
     * @returns {string} An Asana Portfolio list.
     */
    getPortfolios(opts = {}) {
      return this._makeRequest({
        path: "portfolios",
        ...opts,
      });
    },
    /**
     * Get the items in an Asana Portfolio.
     *
     * @param {string} portfolioId - The portfolio GID.
     *
     * @returns {string} An Asana Project list.
     */
    getPortfolioItems({
      portfolioId, ...opts
    }) {
      return this._makeRequest({
        path: `portfolios/${portfolioId}/items`,
        ...opts,
      });
    },
    /**
     * Get an Asana Story.
     *
     * @param {string} storyId - The story GID.
     *
     * @returns {string} An Asana Story.
     */
    getStory({
      storyId, ...opts
    }) {
      return this._makeRequest({
        path: `stories/${storyId}`,
        ...opts,
      });
    },
    /**
     * Get an Asana Task.
     *
     * @param {string} taskId - The Task GID.
     *
     * @returns {string} An Asana Task.
     */
    getTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        path: `tasks/${taskId}`,
        ...opts,
      });
    },
    /**
     * Get an Asana Task list.
     *
     * @param {string} opts - The params to filter tasks.
     *
     * @returns {string} An Asana Task list.
     */
    getTasks(opts = {}) {
      return this._makeRequest({
        path: "tasks",
        ...opts,
      });
    },
    /**
     * Search for tasks in a workspace.
     *
     * @param {string} workspace - The workspace GID.
     * @param {object} opts - The params to filter tasks.
     *
     * @returns {string} An Asana Task list.
     */
    searchTasks({
      workspace, ...opts
    }) {
      return this._makeRequest({
        path: `workspaces/${workspace}/tasks/search`,
        ...opts,
      });
    },
    /**
     * Get an Asana Section list.
     *
     * @param {string} projectId - A Project GID.
     *
     * @returns {string} An Asana Section list.
     */
    getSections({
      project, ...opts
    }) {
      return this._makeRequest({
        path: `projects/${project}/sections`,
        ...opts,
      });
    },
    /**
     * Get an Asana Tag.
     *
     * @param {string} tagId - A Tag GID.
     *
     * @returns {string} An Asana Tag.
     */
    getTag({
      tagId, ...opts
    }) {
      return this._makeRequest({
        path: `tags/${tagId}`,
        ...opts,
      });
    },
    /**
     * Get an Asana Tag list.
     *
     * @returns {string} An Asana Tag list.
     */
    getTags(opts = {}) {
      return this._makeRequest({
        path: "tags",
        ...opts,
      });
    },
    /**
     * Get an Asana Team.
     *
     * @param {string} teamId - A Team GID.
     *
     * @returns {string} An Asana Team.
     */
    getTeam({
      teamId, ...opts
    }) {
      return this._makeRequest({
        path: `teams/${teamId}`,
        ...opts,
      });
    },
    /**
     * Get an Asana Team list.
     *
     * @param {string} workspaces - A Workspace GID list.
     *
     * @returns {string} An Asana Team list.
     */
    async getTeams(workspaces) {
      if (!Array.isArray(workspaces)) workspaces = [
        workspaces,
      ];

      let teams = [];

      for (const workspace of workspaces) {
        const { data } = (await this._makeRequest({
          path: `workspaces/${workspace}/teams`,
        }));
        teams = teams.concat(data);
      }

      return teams;
    },
    /**
     * Get an Asana Team list for a workspace.
     *
     * @param {string} workspace - A Workspace GID.
     * @param {object} opts - The params to filter the teams.
     *
     * @returns {string} An Asana Team list.
     */
    async getTeamsForWorkspace({
      workspace, ...opts
    }) {
      return this._makeRequest({
        path: `workspaces/${workspace}/teams`,
        ...opts,
      });
    },
    /**
     * Get an Asana Workspace Membership.
     *
     * @param {string} membershipId - A Workspace Membership GID.
     *
     * @returns {string} A Workspace Membership.
     */
    getWorkspaceMembership({
      membershipId, ...opts
    }) {
      return this._makeRequest({
        path: `workspace_memberships/${membershipId}`,
        ...opts,
      });
    },
    /**
     * Get an Asana User.
     *
     * @param {string} userId - An User GID.
     *
     * @returns {string} An Asana User.
     */
    getUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `users/${userId}`,
        ...opts,
      });
    },
    /**
     * Get an Asana User list.
     *
     * @param {string} opts.params - The params to filter the users.
     *
     * @returns {string} An Asana User list.
     */
    getUsers(opts = {}) {
      return this._makeRequest({
        path: "users",
        ...opts,
      });
    },
    getUserTaskList({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `users/${userId}/user_task_list`,
        ...opts,
      });
    },
    async getTasksFromUserTaskList({
      params, $,
    }) {
      const { data: taskList } = await this.getUserTaskList({
        userId: "me",
        params,
        $,
      });
      return this._makeRequest({
        path: `user_task_lists/${taskList.gid}/tasks`,
        $,
      });
    },
    getTasksForUserTaskList({
      userTaskListId, ...opts
    }) {
      return this._makeRequest({
        path: `user_task_lists/${userTaskListId}/tasks`,
        ...opts,
      });
    },
    listTaskTemplates(opts = {}) {
      return this._makeRequest({
        path: "task_templates",
        ...opts,
      });
    },
    createTaskFromTemplate({
      taskTemplateId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `task_templates/${taskTemplateId}/instantiateTask`,
        ...opts,
      });
    },
  },
};
