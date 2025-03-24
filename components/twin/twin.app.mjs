import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "twin",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "Identifier of a task",
      async options() {
        const tasks = await this.listTasks();
        return tasks?.map(({
          id: value, goal,
        }) => ({
          value,
          label: `${goal.slice(0, 50)}...`,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.twin.so";
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
      };
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
    browse(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/browse",
        ...args,
      });
    },
    getTask({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `/task/${taskId}`,
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
  },
};
