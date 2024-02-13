import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "morningmate",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
    },
    scheduleTime: {
      type: "string",
      label: "Schedule Time",
      description: "The time to set the schedule",
      optional: true,
    },
    taskTitle: {
      type: "string",
      label: "Task Title",
      description: "The title of the task",
    },
    taskDescription: {
      type: "string",
      label: "Task Description",
      description: "The description of the task",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text of the notification message",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.morningmate.com";
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
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        data,
        params,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async sendNotification({ message }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/bots/{botId}/notifications",
        data: {
          message,
        },
      });
    },
    async createSchedule({
      projectId, scheduleTime,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/posts/projects/${projectId}/schedules`,
        data: {
          schedule_time: scheduleTime,
        },
      });
    },
    async createTask({
      projectId, taskTitle, taskDescription,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/posts/projects/${projectId}/tasks`,
        data: {
          task_title: taskTitle,
          task_description: taskDescription,
        },
      });
    },
  },
};
