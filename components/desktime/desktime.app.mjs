import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "desktime",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to track time for",
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to track time for (optional)",
      optional: true,
    },
    project: {
      type: "string",
      label: "Project Name",
      description: "The name of the project",
    },
    task: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://desktime.com/api/v2/json";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...params,
          apiKey: this.$auth.api_key,
        },
      });
    },
    async createProject(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create-project",
        ...args,
      });
    },
    async startTracking(args = {}) {
      return this._makeRequest({
        path: "/start-project",
        ...args,
      });
    },
    async stopTracking(args = {}) {
      return this._makeRequest({
        path: "/stop-project",
        ...args,
      });
    },
  },
};
