import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "exhibitday",
  propDefinitions: {
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event",
    },
    eventDate: {
      type: "string",
      label: "Event Date",
      description: "The date of the event",
    },
    eventLocation: {
      type: "string",
      label: "Event Location",
      description: "The location of the event",
    },
    eventDescription: {
      type: "string",
      label: "Event Description",
      description: "The description of the event",
      optional: true,
    },
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "The attendees of the event",
      optional: true,
    },
    cost: {
      type: "integer",
      label: "Cost",
      description: "The cost of the event",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
    },
    assignee: {
      type: "string",
      label: "Assignee",
      description: "The user assigned to the task",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task",
    },
    taskStatus: {
      type: "string",
      label: "Task Status",
      description: "The status of the task",
    },
    taskDescription: {
      type: "string",
      label: "Task Description",
      description: "The description of the task",
      optional: true,
    },
    taskComponent: {
      type: "string",
      label: "Task Component",
      description: "The component of the task",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.exhibitday.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createEvent(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/events",
      });
    },
    async createTask(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/tasks",
      });
    },
    async updateTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "PUT",
        path: `/tasks/${taskId}`,
      });
    },
    async getNewEvent(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/events",
      });
    },
    async getNewTaskAssigned(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/tasks",
      });
    },
    async getTaskCompleted(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/tasks/completed",
      });
    },
  },
};
