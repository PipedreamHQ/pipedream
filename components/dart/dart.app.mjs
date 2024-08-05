import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dart",
  propDefinitions: {
    dartboard: {
      type: "string",
      label: "Dartboard",
      description: "The dartboard where the task is or will be located",
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
    },
    newTaskName: {
      type: "string",
      label: "New Task Name",
      description: "The new name for the task",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    newDescription: {
      type: "string",
      label: "New Description",
      description: "The new description for the task",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date for the task",
      optional: true,
    },
    newDueDate: {
      type: "string",
      label: "New Due Date",
      description: "The new due date for the task",
      optional: true,
    },
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "The person the task is assigned to",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.itsdart.com/api/v0";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/dartboards/${opts.dartboard}/tasks`,
        data: opts,
      });
    },
    async updateTask(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/dartboards/${opts.dartboard}/tasks/${opts.taskId}`,
        data: opts,
      });
    },
    async checkAndCreateTask(opts = {}) {
      const tasks = await this._makeRequest({
        path: `/dartboards/${opts.dartboard}/tasks`,
      });
      const existingTask = tasks.find((task) => task.name === opts.taskName);
      if (!existingTask) {
        return this.createTask(opts);
      }
      return existingTask;
    },
  },
};
