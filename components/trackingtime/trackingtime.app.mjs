import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "trackingtime",
  propDefinitions: {
    taskId: {
      label: "Task ID",
      description: "The task ID",
      type: "string",
      async options() {
        const { data: tasks } = await this.getTasks();

        return tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
    projectId: {
      label: "Project ID",
      description: "The project ID",
      type: "string",
      async options() {
        const { data: projects } = await this.getProjects();

        return projects.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
  },
  methods: {
    _appPassword() {
      return this.$auth.app_password;
    },
    _apiUrl() {
      return "https://app.trackingtime.co/api/v4";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        auth: {
          username: "API_TOKEN",
          password: this._appPassword(),
        },
      });
    },
    startTrackingTime({
      taskId, args,
    }) {
      return this._makeRequest({
        path: `/tasks/track/${taskId}`,
        ...args,
      });
    },
    stopTrackingTime({
      taskId, args,
    }) {
      return this._makeRequest({
        path: `/tasks/stop/${taskId}`,
        method: "post",
        ...args,
      });
    },
    getTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    getProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
  },
};
