import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsofttodo",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task",
      description: "Identifier of a task",
      async options({ taskListId }) {
        if (!taskListId) {
          return [];
        }
        const { value } = await this.listTasks({
          taskListId,
        });
        return value?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taskListId: {
      type: "string",
      label: "Task List",
      description: "Identifier of a task list",
      async options() {
        const { value } = await this.listLists();
        return value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task.",
    },
    dueDateTime: {
      type: "string",
      label: "Due Date Time",
      description: "The date and time the task is due. The timestamp type represents date and time information using ISO 8601 format and is always in UTC time.",
      optional: true,
    },
    reminderDateTime: {
      type: "string",
      label: "Reminder Date",
      description: "The date for the reminder in ISO 8601 format",
      optional: true,
    },
    isReminderOn: {
      type: "boolean",
      label: "Turn Reminder On",
      description: "Whether to turn the reminder on",
      optional: true,
    },
    importance: {
      type: "string",
      label: "Importance",
      description: "The importance of the task",
      options: [
        "low",
        "normal",
        "high",
      ],
      optional: true,
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time zone for Due Date and/or Reminder Date",
      optional: true,
      async options() {
        const timeZonesResponse = await this.getSupportedTimeZones();
        return timeZonesResponse.value.map((tz) => ({
          label: tz.displayName,
          value: tz.alias,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
    async createHook(args = {}) {
      const response = await this._makeRequest({
        method: "POST",
        path: "/subscriptions",
        ...args,
      });
      return response;
    },
    async renewHook({
      hookId, ...args
    }) {
      return await this._makeRequest({
        method: "PATCH",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    async deleteHook({
      hookId, ...args
    }) {
      return await this._makeRequest({
        method: "DELETE",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    async getSupportedTimeZones() {
      return this._makeRequest({
        method: "GET",
        path: "/me/outlook/supportedTimeZones",
      });
    },
    getTask({
      taskListId, taskId, ...args
    }) {
      return this._makeRequest({
        path: `/me/todo/lists/${taskListId}/tasks/${taskId}`,
        ...args,
      });
    },
    listTasks({
      taskListId, ...args
    }) {
      return this._makeRequest({
        path: `/me/todo/lists/${taskListId}/tasks`,
        ...args,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "/me/todo/lists",
        ...args,
      });
    },
    createTask({
      taskListId, ...args
    }) {
      return this._makeRequest({
        path: `/me/todo/lists/${taskListId}/tasks`,
        method: "POST",
        ...args,
      });
    },
    createList(args = {}) {
      return this._makeRequest({
        path: "/me/todo/lists",
        method: "POST",
        ...args,
      });
    },
    updateTask({
      taskId, taskListId, ...args
    }) {
      return this._makeRequest({
        path: `/me/todo/lists/${taskListId}/tasks/${taskId}`,
        method: "PATCH",
        ...args,
      });
    },
  },
};
