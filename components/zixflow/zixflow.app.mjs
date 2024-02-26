import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zixflow",
  propDefinitions: {
    activityId: {
      type: "string",
      label: "Activity ID",
      description: "The unique identifier for the activity or task.",
    },
    taskTitle: {
      type: "string",
      label: "Task Title",
      description: "The title of the task.",
    },
    taskDescription: {
      type: "string",
      label: "Task Description",
      description: "The description of the task.",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the task. (Optional)",
      optional: true,
    },
    assignedMembers: {
      type: "string[]",
      label: "Assigned Members",
      description: "The members assigned to the task. (Optional)",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.zixflow.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createTask({
      taskTitle, taskDescription, dueDate, assignedMembers,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        data: {
          title: taskTitle,
          description: taskDescription,
          due_date: dueDate,
          assigned_members: assignedMembers,
        },
      });
    },
    async updateTask({
      activityId, taskTitle, taskDescription, dueDate, assignedMembers,
    }) {
      const data = {
        ...(taskTitle && {
          title: taskTitle,
        }),
        ...(taskDescription && {
          description: taskDescription,
        }),
        ...(dueDate && {
          due_date: dueDate,
        }),
        ...(assignedMembers && {
          assigned_members: assignedMembers,
        }),
      };
      return this._makeRequest({
        method: "PUT",
        path: `/tasks/${activityId}`,
        data,
      });
    },
    async removeTask({ activityId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/tasks/${activityId}`,
      });
    },
  },
  version: `0.0.${Date.now()}`,
};
