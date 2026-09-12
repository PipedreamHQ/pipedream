import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "figranium",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The task to operate on. Run **List Tasks** to retrieve available task IDs.",
      async options() {
        const { tasks } = await this.listTasks();
        return (tasks || []).map(({
          id: value, name, description,
        }) => ({
          value,
          label: description
            ? `${name} - ${description}`
            : name,
        }));
      },
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Execution mode for the task",
      options: [
        {
          label: "Scrape (fast, non-interactive, headless)",
          value: "scrape",
        },
        {
          label: "Agent (automated browser interaction, multi-step)",
          value: "agent",
        },
        {
          label: "Headful (visible, interactive debug session)",
          value: "headful",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.base_url.replace(/\/+$/, "");
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...opts.headers,
        },
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        path: "/api/tasks/list",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/tasks",
        ...opts,
      });
    },
    updateTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/api/tasks/${taskId}`,
        ...opts,
      });
    },
    deleteTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/api/tasks/${taskId}`,
        ...opts,
      });
    },
    executeTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/tasks/${taskId}/api`,
        ...opts,
      });
    },
    listExecutions(opts = {}) {
      return this._makeRequest({
        path: "/api/executions/list",
        ...opts,
      });
    },
    listSchedules(opts = {}) {
      return this._makeRequest({
        path: "/api/schedules",
        ...opts,
      });
    },
    getAllScheduleStatus(opts = {}) {
      return this._makeRequest({
        path: "/api/schedules/status/all",
        ...opts,
      });
    },
    getScheduleStatus({
      taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/schedules/${taskId}/status`,
        ...opts,
      });
    },
    setSchedule({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/schedules/${taskId}`,
        ...opts,
      });
    },
    deleteSchedule({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/api/schedules/${taskId}`,
        ...opts,
      });
    },
    describeSchedule({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/schedules/${taskId}/describe`,
        ...opts,
      });
    },
  },
};
