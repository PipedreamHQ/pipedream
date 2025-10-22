import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 25;

export default {
  type: "app",
  app: "asana",
  propDefinitions: {
    organizations: {
      label: "Organizations",
      description: "List of organizations. This field uses the organization GID.",
      type: "string[]",
      async options() {
        const organizations = await this.getOrganizations();
        return organizations?.map((organization) => ({
          label: organization.name,
          value: organization.gid,
        })) || [];
      },
    },
    workspaces: {
      label: "Workspaces",
      description: "List of workspaces. This field uses the workspace GID.",
      type: "string[]",
      async options({ prevContext }) {
        const params = {
          limit: DEFAULT_LIMIT,
        };
        if (prevContext?.offset) {
          params.offset = prevContext.offset;
        }
        const {
          data: workspaces, next_page: next,
        } = await this.getWorkspaces({
          params,
        });
        const options = workspaces?.map((workspace) => ({
          label: workspace.name,
          value: workspace.gid,
        })) || [];
        return {
          options,
          context: {
            offset: next?.offset,
          },
        };
      },
    },
    teams: {
      label: "Teams",
      description: "List of teams. This field uses the team GID.",
      type: "string[]",
      async options({ workspace }) {
        const teams = await this.getTeams(workspace);
        return teams?.map((team) => ({
          label: team.name,
          value: team.gid,
        })) || [];
      },
    },
    projects: {
      label: "Projects",
      description: "List of projects. This field uses the project GID.",
      type: "string[]",
      async options({
        workspace, prevContext,
      }) {
        const params = {
          workspace,
          limit: DEFAULT_LIMIT,
        };
        if (prevContext?.offset) {
          params.offset = prevContext.offset;
        }
        const {
          data: projects, next_page: next,
        } = await this.getProjects({
          params,
        });
        const options = projects?.map((tag) => ({
          label: tag.name,
          value: tag.gid,
        })) || [];
        return {
          options,
          context: {
            offset: next?.offset,
          },
        };
      },
    },
    tags: {
      label: "Tags",
      description: "List of tags. This field uses the tag GID.",
      type: "string[]",
      async options({
        prevContext, workspace,
      }) {
        const params = {
          limit: DEFAULT_LIMIT,
          workspace,
        };
        if (prevContext?.offset) {
          params.offset = prevContext.offset;
        }
        const {
          data: tags, next_page: next,
        } = await this.getTags({
          params,
        });
        const options = tags?.map((tag) => ({
          label: tag.name,
          value: tag.gid,
        })) || [];
        return {
          options,
          context: {
            offset: next?.offset,
          },
        };
      },
    },
    users: {
      label: "Users",
      description: "List of users. This field uses the user GID.",
      type: "string[]",
      async options({
        prevContext, workspace,
      }) {
        const params = {
          limit: DEFAULT_LIMIT,
          workspace,
        };
        if (prevContext?.offset) {
          params.offset = prevContext.offset;
        }
        const {
          data: users, next_page: next,
        } = await this.getUsers({
          params,
        });
        const options = users?.map((user) => ({
          label: user.name,
          value: user.gid,
        })) || [];
        return {
          options,
          context: {
            offset: next?.offset,
          },
        };
      },
    },
    tasks: {
      label: "Tasks",
      description: "List of tasks. This field uses the task GID.",
      type: "string[]",
      async options({
        project, prevContext,
      }) {
        if (!project) {
          return [];
        }
        const params = {
          project,
          limit: DEFAULT_LIMIT,
        };
        if (prevContext?.offset) {
          params.offset = prevContext.offset;
        }
        const {
          data: tasks, next_page: next,
        } = await this.getTasks({
          params,
        });
        const options = tasks?.map(({
          name: label, gid: value,
        }) => ({
          label,
          value,
        })) || [];
        return {
          options,
          context: {
            offset: next?.offset,
          },
        };
      },
    },
    sections: {
      label: "Sections",
      description: "List of sections. This field uses the section GID.",
      type: "string[]",
      async options({
        project, prevContext,
      }) {
        if (!project) {
          return [];
        }
        const params = {
          limit: DEFAULT_LIMIT,
        };
        if (prevContext?.offset) {
          params.offset = prevContext.offset;
        }
        const {
          data: sections, next_page: next,
        } = await this.getSections({
          project,
          params,
        });
        const options = sections?.map((section) => ({
          label: section.name,
          value: section.gid,
        })) || [];
        return {
          options,
          context: {
            offset: next?.offset,
          },
        };
      },
    },
    taskFields: {
      label: "Task Fields",
      description: "List of task fields that will emit events when updated. This field uses the field code.",
      type: "string[]",
      async options({ project }) {
        const { data: tasks } = await this.getTasks({
          params: {
            project,
            limit: 1,
          },
        });
        if (!tasks || tasks.length === 0) {
          return [];
        }
        const { data: task } = await this.getTask({
          taskId: tasks[0].gid,
        });
        return Object.keys(task);
      },
    },
    taskTemplate: {
      type: "string",
      label: "Task Template",
      description: "The identifier of a task template",
      async options({
        project, prevContext,
      }) {
        const params = {
          project,
          limit: DEFAULT_LIMIT,
        };
        if (prevContext?.offset) {
          params.offset = prevContext.offset;
        }
        const {
          data, next_page: next,
        } = await this.listTaskTemplates({
          params,
        });
        return {
          options: data?.map(({
            gid: value, name: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            offset: next?.offset,
          },
        };
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
    async getOrganizations() {
      const params = {};
      const workspaces = [];
      do {
        const {
          data, next_page: next,
        } = await this.getWorkspaces({
          params,
        });
        workspaces.push(...data);
        params.offset = next?.offset;
      } while (params.offset);

      const organizations = workspaces.filter(async (workspace) => {
        const { data } = await this.getWorkspace({
          workspaceId: workspace.gid,
        });
        return data?.is_organization;
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
