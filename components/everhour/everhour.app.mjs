import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "everhour",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options(opts) {
        const tasks = await this.getProjectTasks(opts.projectId);
        return tasks.map((task) => ({
          label: task.name,
          value: task.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.everhour.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    async getProjectTasks(projectId, opts = {}) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks`,
        ...opts,
      });
    },
    async emitClientCreatedEvent(projectId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "api:client:created",
          target: "/your_webhook_url_for_client_created",
          projectId,
        },
        ...opts,
      });
    },
    async emitTaskCreatedEvent(projectId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "api:task:created",
          target: "/your_webhook_url_for_task_created",
          projectId,
        },
        ...opts,
      });
    },
    async emitTimeUpdatedEvent(projectId, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "api:time:updated",
          target: "/your_webhook_url_for_time_updated",
          projectId,
        },
        ...opts,
      });
    },
    async createTask({
      projectId, name, section, labels, position, description, dueon, status, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/tasks`,
        data: {
          name,
          section,
          labels,
          position,
          description,
          dueon,
          status,
        },
        ...opts,
      });
    },
    async startTimer({
      taskId, userdate, comment, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/timers/start",
        data: {
          taskId,
          userdate,
          comment,
        },
        ...opts,
      });
    },
    async stopTimer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/timers/stop",
        ...opts,
      });
    },
  },
};
