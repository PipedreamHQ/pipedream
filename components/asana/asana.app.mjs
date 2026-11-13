import { axios } from "@pipedream/platform";

// Sources run in Pipedream's workflow builder (not MCP), so they keep
// auto-populating dropdowns via async `options()`. Their propDefinitions are
// suffixed `Async` and kept separate from the static, MCP-safe ones actions use.
const DEFAULT_LIMIT = 25;
// Longest `Retry-After` (seconds) we'll wait out before retrying a 429. Three
// waits of this length stay well inside the 60s tool timeout.
const MAX_RETRY_AFTER_SECONDS = 10;

export default {
  type: "app",
  app: "asana",
  propDefinitions: {
    organizations: {
      label: "Organizations",
      description: "List of organizations. This field uses the organization GID.",
      type: "string[]",
      // Only used by sources (workflow builder), never by MCP actions, so an
      // auto-populating dropdown is safe here.
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
      description: "List of workspaces. This field uses the workspace GID (e.g. `1200123456789012`). Use the **List Workspaces** action to retrieve available workspace GIDs.",
      type: "string[]",
    },
    workspacesAsync: {
      label: "Workspaces",
      description: "List of workspaces. This field uses the workspace GID (e.g. `1200123456789012`).",
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
      description: "List of teams. Use the **List Teams** action to retrieve available team GIDs.",
      type: "string[]",
    },
    projects: {
      label: "Projects",
      description: "List of projects. This field uses the project GID (e.g. `1204567890123456`). Use **Search Projects** to find available project GIDs (the `gid` field).",
      type: "string[]",
    },
    projectsAsync: {
      label: "Projects",
      description: "List of projects. This field uses the project GID (e.g. `1204567890123456`).",
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
      description: "List of tags. This field uses the tag GID (e.g. `1202345678901234`). Use **List Tags** to find available tag GIDs (the `gid` field).",
      type: "string[]",
    },
    tagsAsync: {
      label: "Tags",
      description: "List of tags. This field uses the tag GID (e.g. `1202345678901234`).",
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
      description: "List of users. This field uses the user `gid` (e.g. `1198765432109876`). Use the **List Users** action to retrieve available user GIDs.",
      type: "string[]",
    },
    usersAsync: {
      label: "Users",
      description: "List of users. This field uses the user `gid` (e.g. `1198765432109876`).",
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
      description: "List of tasks. This field uses the task GID (e.g. `1202345678901234`). Use **Search Tasks** to find available task GIDs (the `gid` field). Requires a project GID from **Search Projects**.",
      type: "string[]",
    },
    tasksAsync: {
      label: "Tasks",
      description: "List of tasks. This field uses the task GID (e.g. `1202345678901234`).",
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
      description: "List of sections. This field uses the section GID (e.g. `1203456789012345`). Use **Search Sections** to find available section GIDs (the `gid` field). Requires a project GID from **Search Projects**.",
      type: "string[]",
    },
    taskFields: {
      label: "Task Fields",
      description: "List of task fields that will emit events when updated.",
      type: "string[]",
      // Asana task fields that can be reported as changed by a webhook event
      // (developers.asana.com/reference/task). Many of these — custom_fields,
      // tags, followers, dependencies, dependents, parent, memberships — are
      // omitted from a task's default GET response unless explicitly
      // requested via opt_fields, so this is a fixed catalog rather than
      // anything derived from a live task sample.
      options: [
        "approval_status",
        "assignee",
        "assignee_section",
        "assignee_status",
        "actual_time_minutes",
        "completed",
        "completed_at",
        "custom_fields",
        "dependencies",
        "dependents",
        "due_at",
        "due_on",
        "external",
        "followers",
        "html_notes",
        "is_rendered_as_separator",
        "liked",
        "memberships",
        "name",
        "notes",
        "num_subtasks",
        "parent",
        "projects",
        "start_at",
        "start_on",
        "tags",
        "workspace",
      ],
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
    async _makeRequest({
      path, $ = this, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._headers(),
        ...opts,
      };
      // Asana rate-limits per user and answers 429 with a `Retry-After` (seconds).
      // Wait exactly that long and retry a few times instead of failing the whole
      // action. Never retry before it elapses: that fails again and can use up more
      // quota. If it's longer than we can wait within the tool timeout, surface the
      // 429 right away rather than retrying early.
      const maxRetries = 3;
      for (let attempt = 0; ; attempt++) {
        try {
          return await axios($, config);
        } catch (err) {
          if (err?.response?.status !== 429 || attempt >= maxRetries) {
            throw err;
          }
          const retryAfter = Number(err.response.headers?.["retry-after"]);
          const hasRetryAfter = Number.isFinite(retryAfter) && retryAfter >= 0;
          if (hasRetryAfter && retryAfter > MAX_RETRY_AFTER_SECONDS) {
            throw err;
          }
          const delayMs = hasRetryAfter
            ? retryAfter * 1000
            : (2 ** attempt) * 1000 + Math.floor(Math.random() * 500);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
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
     * Search a workspace with Asana's typeahead (one request, not paginated).
     * Matches the start of words, case-insensitively, and returns the top results.
     *
     * @param {string} workspaceId - The workspace GID.
     *
     * @returns {object} Typeahead results in `data`.
     */
    getTypeahead({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/typeahead`,
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
