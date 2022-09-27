import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "yanado",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      async options() {
        const tasks = await this.findTasks();
        return tasks.map((task) => ({
          label: task.name,
          value: task.taskId,
        }));
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      async options() {
        const lists = await this.getLists();
        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    assigneeId: {
      type: "string",
      label: "Assignee ID",
      async options({ listId }) {
        const users = await this.getUsers({
          listId,
        });
        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    statusId: {
      type: "string",
      label: "Status ID",
      async options({ listId }) {
        const statuses = await this.getStatuses({
          listId,
        });
        return statuses.map((status) => ({
          label: status.name,
          value: status.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.yanado.com/public-api";
    },
    _headers() {
      return {
        "X-API-Key": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    async getLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    async getUsers({
      listId, ...opts
    }) {
      if (!listId) {
        throw new ConfigurationError("Missing required `listId` parameter");
      }
      return this._makeRequest({
        path: `/lists/${listId}/users`,
        ...opts,
      });
    },
    async getStatuses({
      listId, ...opts
    }) {
      if (!listId) {
        throw new ConfigurationError("Missing required `listId` parameter");
      }
      return this._makeRequest({
        path: `/lists/${listId}/statuses`,
        ...opts,
      });
    },
    async findTasks(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...opts,
      });
    },
    async createTask(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        method: "post",
        ...opts,
      });
    },
    async updateTask({
      taskId, ...opts
    }) {
      if (!taskId) {
        throw new ConfigurationError("Missing required `taskId` parameter");
      }
      return this._makeRequest({
        path: `/tasks/${taskId}`,
        method: "put",
        ...opts,
      });
    },
  },
};
