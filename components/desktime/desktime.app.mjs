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
    name: {
      type: "string",
      label: "Project Name",
      description: "The name of the project",
    },
    tasks: {
      type: "string[]",
      label: "Tasks",
      description: "A list of tasks for the project (optional)",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://desktime.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "App-Key": this.$auth.api_key,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async createProject({
      name, tasks,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        data: {
          name,
          tasks: tasks.map(JSON.parse),
        },
      });
    },
    async startTracking({
      projectId, taskId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/tracking",
        data: {
          projectId,
          taskId,
        },
      });
    },
    async stopTracking({
      projectId, taskId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: "/tracking",
        data: {
          projectId,
          taskId,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
