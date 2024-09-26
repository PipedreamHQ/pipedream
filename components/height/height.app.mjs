import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "height",
  propDefinitions: {
    listIds: {
      type: "string[]",
      label: "List IDs",
      description: "The list(s) to which the task belongs",
      async options({
        taskId, excludeTaskLists = false,
      }) {
        let { list } = await this.listLists();
        if (taskId) {
          const { listIds } = await this.getTask({
            taskId,
          });
          list = excludeTaskLists
            ? list.filter(({ id }) => !listIds.includes(id))
            : list.filter(({ id }) => listIds.includes(id));
        }
        list = list.filter(({ type }) => type === "list" || type === "projects");
        return list?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    assigneeIds: {
      type: "string[]",
      label: "Assignee IDs",
      description: "The IDs of the users to assign to the task",
      optional: true,
      async options({
        taskId, excludeTaskAssignees = false,
      }) {
        let { list } = await this.listUsers();
        if (taskId) {
          const { assigneesIds } = await this.getTask({
            taskId,
          });
          list = excludeTaskAssignees
            ? list.filter(({ id }) => !assigneesIds.includes(id))
            : list.filter(({ id }) => assigneesIds.includes(id));
        }
        return list?.map(({
          id: value, username: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options() {
        const { list } = await this.searchTasks({
          params: {
            filters: {
              status: {
                values: [
                  "backLog",
                  "inProgress",
                  "done",
                ],
              },
            },
          },
        });
        return list?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task",
      optional: true,
      options: [
        "backLog",
        "inProgress",
        "done",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.height.app";
    },
    _headers() {
      return {
        "Authorization": `api-key ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
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
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    searchTasks(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        ...opts,
      });
    },
    updateTask(opts = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: "/tasks",
        ...opts,
      });
    },
  },
};
