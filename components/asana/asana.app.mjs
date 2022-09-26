import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "asana",
  propDefinitions: {
    organizations: {
      label: "Organizations",
      description: "List of organizations. This field use the organization GID.",
      type: "string[]",
      async options() {
        const organizations = await this.getOrganizations();

        return organizations.map((organization) => ({
          label: organization.name,
          value: organization.gid,
        }));
      },
    },
    workspaces: {
      label: "Workspaces",
      description: "List of workspaces. This field use the workspace GID.",
      type: "string[]",
      async options() {
        const workspaces = await this.getWorkspaces();

        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace.gid,
        }));
      },
    },
    teams: {
      label: "Teams",
      description: "List of teams. This field use the team GID.",
      type: "string[]",
      async options() {
        const teams = await this.getTeams();

        return teams.map((team) => ({
          label: team.name,
          value: team.gid,
        }));
      },
    },
    projects: {
      label: "Projects",
      description: "List of projects. This field use the project GID.",
      type: "string[]",
      async options({ workspace }) {
        const projects = await this.getProjects(workspace);

        return projects.map((tag) => ({
          label: tag.name,
          value: tag.gid,
        }));
      },
    },
    tags: {
      label: "Tags",
      description: "List of tags. This field use the tag GID.",
      type: "string[]",
      async options() {
        const tags = await this.getTags();

        return tags.map((tag) => {
          return {
            label: tag.name,
            value: tag.gid,
          };
        });
      },
    },
    users: {
      label: "Users",
      description: "List of users. This field use the user GID.",
      type: "string[]",
      async options() {
        const users = await this.getUsers();

        return users.map((user) => ({
          label: user.name,
          value: user.gid,
        }));
      },
    },
    tasks: {
      label: "Tasks",
      description: "List of tasks. This field use the task GID.",
      type: "string[]",
      async options({ project }) {
        const tasks = await this.getTasks({
          params: {
            project,
          },
        });
        return tasks.map(({
          name: label, gid: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    sections: {
      label: "Sections",
      description: "List of sections. This field use the section GID.",
      type: "string[]",
      async options({ project }) {
        const sections = await this.getSections(project);

        return sections.map((section) => {
          return {
            label: section.name,
            value: section.gid,
          };
        });
      },
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
     * @param {object} options - A default Axios options object.
     *
     * @returns {string} The request result data.
     */
    async _makeRequest(path, options = {}, $ = this) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._headers(),
        ...options,
      };
      return axios($, config);
    },
    /**
     * Create a webhook
     *
     * @param {string} body - The body that will be send on request.
     *
     * @returns {object} A Asana Webhook.
     */
    async createWebHook(body) {
      const authorization = await this._makeRequest("webhooks", {
        method: "post",
        data: body,
      });

      return authorization.data;
    },
    /**
     * Remove a Webhook.
     *
     * @param {string} hookId - The Asana Webhook GID.
     */
    async deleteWebhook(hookId) {
      await this._makeRequest(`webhooks/${hookId}`, {
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
    async getWorkspace(workspaceId) {
      return (await this._makeRequest(`workspaces/${workspaceId}`)).data;
    },
    /**
     * Get an Asana Workspace list.
     *
     * @returns {string} An Asana Workspace object list.
     */
    async getWorkspaces() {
      return (await this._makeRequest("workspaces")).data;
    },
    /**
     * Get an Asana Organizations list.
     *
     * @returns {string} An Asana Organizations list.
     */
    async getOrganizations() {
      const workspaces = await this.getWorkspaces();

      const organizations = workspaces.filter(async (workspace) => {
        workspace = await this.getWorkspace(workspace.gid);

        return workspace.is_organization;
      });

      return organizations;
    },
    /**
     * Get an Asana Project.
     *
     * @param {string} projectId - The project GID.
     *
     * @returns {string} An Asana Project.
     */
    async getProject(projectId) {
      return (await this._makeRequest(`projects/${projectId}`)).data;
    },
    /**
     * Get an Asana Project list.
     *
     * @param {string} workspaceId - The Workspace GID.
     *
     * @returns {string} An Asana Project list.
     */
    async getProjects(workspaceId, params = {}, $) {
      return (await this._makeRequest("projects", {
        params: {
          workspace: workspaceId,
          ...params,
        },
      }, $)).data;
    },
    /**
     * Get an Asana Story.
     *
     * @param {string} storyId - The story GID.
     *
     * @returns {string} An Asana Story.
     */
    async getStory(storyId) {
      return (await this._makeRequest(`stories/${storyId}`)).data;
    },
    /**
     * Get an Asana Task.
     *
     * @param {string} taskId - The Task GID.
     *
     * @returns {string} An Asana Task.
     */
    async getTask(taskId, $) {
      const response = await this._makeRequest(`tasks/${taskId}`, {}, $);
      return response.data;
    },
    /**
     * Get an Asana Task list.
     *
     * @param {string} params - The params to filter tasks.
     *
     * @returns {string} An Asana Task list.
     */
    async getTasks(params, $) {
      const response = await this._makeRequest("tasks", params, $);

      return response.data;
    },
    /**
     * Get an Asana Section list.
     *
     * @param {string} project - A Project GID.
     *
     * @returns {string} An Asana Section list.
     */
    async getSections(project, $) {
      const response = await this._makeRequest(`projects/${project}/sections`, {}, $);

      return response.data ?? [];
    },
    /**
     * Get an Asana Tag.
     *
     * @param {string} tagId - A Tag GID.
     *
     * @returns {string} An Asana Tag.
     */
    async getTag(tagId) {
      return (await this._makeRequest(`tags/${tagId}`)).data;
    },
    /**
     * Get an Asana Tag list.
     *
     * @returns {string} An Asana Tag list.
     */
    async getTags() {
      return (await this._makeRequest("tags")).data;
    },
    /**
     * Get an Asana Team.
     *
     * @param {string} teamId - A Team GID.
     *
     * @returns {string} An Asana Team.
     */
    async getTeam(teamId) {
      return (await this._makeRequest(`teams/${teamId}`)).data;
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
        const response = (await this._makeRequest(`organizations/${workspace}/teams`));

        teams = teams.concat(response.data);
      }

      return teams;
    },
    /**
     * Get an Asana Workspace Membership.
     *
     * @param {string} membership - A Workspace Membership GID.
     *
     * @returns {string} A Workspace Membership.
     */
    async getWorkspaceMembership(membership) {
      return (await this._makeRequest(`workspace_memberships/${membership}`)).data;
    },
    /**
     * Get an Asana User.
     *
     * @param {string} userId - An User GID.
     *
     * @returns {string} An Asana User.
     */
    async getUser(userId) {
      return (await this._makeRequest(`users/${userId}`)).data;
    },
    /**
     * Get an Asana User list.
     *
     * @param {string} params - The params to filter the users.
     *
     * @returns {string} An Asana User list.
     */
    async getUsers(params = {}) {
      const {
        workspace,
        team,
      } = params;

      return (await this._makeRequest("users", {
        params: {
          workspace,
          team,
        },
      })).data;
    },
  },
};
