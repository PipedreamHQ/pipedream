import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "motion",
  propDefinitions: {
    assigneeId: {
      type: "string",
      label: "Assignee Id",
      description: "The user id the task should be assigned to.",
      async options({
        workspaceId, taskId,
      }) {
        if (taskId) {
          const task = await this.getTask({
            taskId,
          });
          workspaceId = task.workspace.id;
        }
        const { users } = await this.listUsers({
          params: {
            workspaceId,
          },
        });

        return users.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    description: {
      type: "string",
      label: "Description",
      description: "Input as GitHub Flavored Markdown.",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "ISO 8601 Due date on the task. REQUIRED for scheduled tasks Example: `2023-06-28T10:11:14.320-06:00`",
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "A duration can be one of the following... `NONE`, `REMINDER`, or a integer greater than 0.",
    },
    labelId: {
      type: "string[]",
      label: "Labels",
      description: "A list of labels to the task.",
      async options({
        workspaceId, taskId,
      }) {
        if (taskId) {
          const task = await this.getTask({
            taskId,
          });
          workspaceId = task.workspace.id;
        }
        const { workspaces } = await this.listWorkspaces();

        const labels = workspaces.filter((workspace) => workspace.id === workspaceId)[0].labels;

        return labels.map((label) => label.name);
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name / title of the task.",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The level priority of the task.",
      options: [
        "ASAP",
        "HIGH",
        "MEDIUM",
        "LOW",
      ],
      default: "MEDIUM",
    },
    projectId: {
      type: "string",
      label: "Project Id",
      description: "The id of the project.",
      async options({
        workspaceId, taskId,
      }) {
        if (taskId) {
          const task = await this.getTask({
            taskId,
          });
          workspaceId = task.workspace.id;
        }
        const { projects } = await this.listProjects({
          params: {
            workspaceId,
          },
        });

        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The id of the task status.",
      async options({
        workspaceId, taskId,
      }) {
        if (taskId) {
          const task = await this.getTask({
            taskId,
          });
          workspaceId = task.workspace.id;
        }
        const statuses = await this.listStatuses({
          params: {
            workspaceId,
          },
        });

        return statuses.map(({ name }) => name);
      },
    },
    taskId: {
      type: "string",
      label: "Task Id",
      description: "The id of the task.",
      async options() {
        const { tasks } = await this.listTasks();

        return tasks.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace Id",
      description: "The id of the workspace.",
      async options() {
        const { workspaces } = await this.listWorkspaces();

        return workspaces.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.usemotion.com/v1";
      // return "https://stoplight.io/mocks/motion/motion-rest-api/33447";
    },
    _getHeaders() {
      return {
        "X-API-Key": this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createTask(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "tasks",
        ...args,
      });
    },
    deleteTask({
      taskId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `tasks/${taskId}`,
        ...args,
      });
    },
    getTask({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `tasks/${taskId}`,
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "projects",
        ...args,
      });
    },
    listStatuses(args = {}) {
      return this._makeRequest({
        path: "statuses",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "tasks",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "users",
        ...args,
      });
    },
    listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "workspaces",
        ...args,
      });
    },
    moveWorkspace({
      taskId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `tasks/${taskId}/move`,
        ...args,
      });
    },
    updateTask({
      taskId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `tasks/${taskId}`,
        ...args,
      });
    },
  },
};
