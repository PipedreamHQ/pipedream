import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "timecamp",
  propDefinitions: {
    taskId: {
      label: "Task ID",
      description: "The task ID",
      type: "string",
      async options() {
        const tasks = await this.getTasks();

        return tasks.map((task) => ({
          label: task.name,
          value: task.task_id,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://www.timecamp.com/third_party/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: this._apiToken(),
        },
        ...args,
      });
    },
    async getTasks({ ...args } = {}) {
      const response = await this._makeRequest({
        path: "/tasks",
        ...args,
      });

      return Object.values(response);
    },
    async getTimeEntries({ ...args } = {}) {
      const response = await this._makeRequest({
        path: "/entries",
        ...args,
      });

      return Object.values(response);
    },
    async createTask({ ...args } = {}) {
      return this._makeRequest({
        path: "/tasks",
        method: "post",
        ...args,
      });
    },
    async createTimeEntry({ ...args } = {}) {
      return this._makeRequest({
        path: "/entries",
        method: "post",
        ...args,
      });
    },
  },
};
