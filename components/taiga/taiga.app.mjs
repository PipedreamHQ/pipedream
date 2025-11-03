import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "taiga",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Select a project or provide a project ID",
      async options({ page }) {
        let projects = [];
        try {
          projects = await this.listProjects({
            params: {
              page: page + 1,
            },
          });
        } catch (error) {
          projects = [];
        }
        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    issuePriority: {
      type: "string",
      label: "Priority",
      description: "Select a priority or provide a priority",
      async options({
        page, projectId,
      }) {
        let priorities = [];
        try {
          priorities = await this.listPriorities({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          priorities = [];
        }
        return priorities.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    issueSeverity: {
      type: "string",
      label: "Severity",
      description: "Select a severity or provide a severity",
      async options({
        page, projectId,
      }) {
        let severities = [];
        try {
          severities = await this.listSeverities({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          severities = [];
        }
        return severities.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    issueStatus: {
      type: "string",
      label: "Status",
      description: "Select a status or provide a status",
      async options({
        page, projectId,
      }) {
        let statuses = [];
        try {
          statuses = await this.listStatuses({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          statuses = [];
        }
        return statuses.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    issueType: {
      type: "string",
      label: "Type",
      description: "Select a type or provide a type",
      async options({
        page, projectId,
      }) {
        let types = [];
        try {
          types = await this.listTypes({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          types = [];
        }
        return types.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a user or provide a user ID",
      async options({
        page, projectId,
      }) {
        let users = [];
        try {
          users = await this.listUsers({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          users = [];
        }
        return users.map(({
          id, full_name_display, username,
        }) => ({
          label: `${full_name_display} (${username})`,
          value: id,
        }));
      },
    },
    milestone: {
      type: "string",
      label: "Milestone",
      description: "Select a milestone or provide a milestone",
      async options({
        page, projectId,
      }) {
        let milestones = [];
        try {
          milestones = await this.listMilestones({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          milestones = [];
        }
        return milestones.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskStatus: {
      type: "string",
      label: "Task Status",
      description: "Select a task status or provide a task status",
      async options({
        page, projectId,
      }) {
        let statuses = [];
        try {
          statuses = await this.listTaskStatuses({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          statuses = [];
        }
        return statuses.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    issueId: {
      type: "string",
      label: "Issue ID",
      description: "Select an issue or provide an issue ID",
      async options({
        page, projectId,
      }) {
        let issues = [];
        try {
          issues = await this.listIssues({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          issues = [];
        }
        return issues.map(({
          id: value, subject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "Select a task or provide a task ID",
      async options({
        page, projectId,
      }) {
        let tasks = [];
        try {
          tasks = await this.listTasks({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          tasks = [];
        }
        return tasks.map(({
          id: value, subject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userStoryId: {
      type: "string",
      label: "User Story ID",
      description: "Select a user story or provide a user story ID",
      async options({
        page, projectId,
      }) {
        let userStories = [];
        try {
          userStories = await this.listUserStories({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          userStories = [];
        }
        return userStories.map(({
          id: value, subject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userStoryStatus: {
      type: "string",
      label: "User Story Status",
      description: "Select a user story status or provide a user story status",
      async options({
        page, projectId,
      }) {
        let statuses = [];
        try {
          statuses = await this.listUserStoryStatuses({
            params: {
              page: page + 1,
              project: projectId,
            },
          });
        } catch (error) {
          statuses = [];
        }
        return statuses.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    issueSubject: {
      type: "string",
      label: "Subject",
      description: "The issue subject/title",
    },
    issueDescription: {
      type: "string",
      label: "Description",
      description: "The issue description",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to associate with the issue",
    },
    issueBlockedNote: {
      type: "string",
      label: "Blocked Note",
      description: "The reason why the issue is blocked",
    },
    isBlocked: {
      type: "boolean",
      label: "Is Blocked",
      description: "Whether the issue is blocked",
    },
    taskSubject: {
      type: "string",
      label: "Subject",
      description: "The task subject/title",
    },
    taskDescription: {
      type: "string",
      label: "Description",
      description: "The task description",
    },
    usOrder: {
      type: "integer",
      label: "User Story Order",
      description: "The order in the user story",
    },
    taskboardOrder: {
      type: "integer",
      label: "Taskboard Order",
      description: "The order in the taskboard",
    },
    userStorySubject: {
      type: "string",
      label: "Subject",
      description: "The user story subject/title",
    },
    userStoryDescription: {
      type: "string",
      label: "Description",
      description: "The user story description",
    },
    backlogOrder: {
      type: "integer",
      label: "Backlog Order",
      description: "The order in the backlog",
    },
    kanbanOrder: {
      type: "integer",
      label: "Kanban Order",
      description: "The order in the kanban",
    },
    sprintOrder: {
      type: "integer",
      label: "Sprint Order",
      description: "The order in the sprint",
    },
    clientRequirement: {
      type: "boolean",
      label: "Client Requirement",
      description: "Whether the user story is a client requirement",
    },
    points: {
      type: "object",
      label: "Points",
      description: "A dictionary of points. The key is the id of the [role](https://docs.taiga.io/api.html#roles-list) and the value is the id of the [points](https://docs.taiga.io/api.html#points-list). Format: `{\"10469741\": 20817870, \"10469742\": 20817871, \"10469743\": 20817872, \"10469744\": 20817873}`",
    },
    teamRequirement: {
      type: "boolean",
      label: "Team Requirement",
      description: "Whether the user story is a team requirement",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/api/v1`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "content-type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    getMe() {
      return this._makeRequest({
        path: "/users/me",
      });
    },
    listPriorities(opts = {}) {
      return this._makeRequest({
        path: "/priorities",
        ...opts,
      });
    },
    listSeverities(opts = {}) {
      return this._makeRequest({
        path: "/severities",
        ...opts,
      });
    },
    listStatuses(opts = {}) {
      return this._makeRequest({
        path: "/issue-statuses",
        ...opts,
      });
    },
    listTypes(opts = {}) {
      return this._makeRequest({
        path: "/issue-types",
        ...opts,
      });
    },
    listMilestones(opts = {}) {
      return this._makeRequest({
        path: "/milestones",
        ...opts,
      });
    },
    listTaskStatuses(opts = {}) {
      return this._makeRequest({
        path: "/task-statuses",
        ...opts,
      });
    },
    listUserStoryStatuses(opts = {}) {
      return this._makeRequest({
        path: "/userstory-statuses",
        ...opts,
      });
    },
    async listProjects({
      params, ...opts
    }) {
      const me = await this.getMe();
      return await this._makeRequest({
        path: "/projects",
        params: {
          member: me.id,
          ...params,
        },
        ...opts,
      });
    },
    createIssue(opts = {}) {
      return this._makeRequest({
        path: "/issues",
        method: "POST",
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        method: "POST",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        method: "POST",
        ...opts,
      });
    },
    createUserStory(opts = {}) {
      return this._makeRequest({
        path: "/userstories",
        method: "POST",
        ...opts,
      });
    },
    deleteTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/tasks/${taskId}`,
        method: "DELETE",
        ...opts,
      });
    },
    updateIssue({
      issueId, ...opts
    }) {
      return this._makeRequest({
        path: `/issues/${issueId}`,
        method: "PATCH",
        ...opts,
      });
    },
    listIssues(opts = {}) {
      return this._makeRequest({
        path: "/issues",
        ...opts,
      });
    },
    getIssue({
      issueId, ...opts
    }) {
      return this._makeRequest({
        path: `/issues/${issueId}`,
        ...opts,
      });
    },
    deleteIssue({
      issueId, ...opts
    }) {
      return this._makeRequest({
        path: `/issues/${issueId}`,
        method: "DELETE",
        ...opts,
      });
    },
    deleteUserStory({
      userStoryId, ...opts
    }) {
      return this._makeRequest({
        path: `/userstories/${userStoryId}`,
        method: "DELETE",
        ...opts,
      });
    },
    getTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/tasks/${taskId}`,
        ...opts,
      });
    },
    getUserStory({
      userStoryId, ...opts
    }) {
      return this._makeRequest({
        path: `/userstories/${userStoryId}`,
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
      });
    },
    updateUserStory({
      userStoryId, ...opts
    }) {
      return this._makeRequest({
        path: `/userstories/${userStoryId}`,
        method: "PATCH",
        ...opts,
      });
    },
    updateProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        method: "PATCH",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...opts,
      });
    },
    updateTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/tasks/${taskId}`,
        method: "PATCH",
        ...opts,
      });
    },
    listUserStories(opts = {}) {
      return this._makeRequest({
        path: "/userstories",
        ...opts,
      });
    },
  },
};
