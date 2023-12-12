import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_tasks",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task list.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "The description of the task.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of registers to be fetched.",
      default: 20,
    },
    taskListId: {
      type: "string",
      label: "Task List",
      description: "The ID of the task list.",
      async options({ prevContext }) {
        const res = await this.getTaskLists(this, {
          pageToken: prevContext.nextPageToken,
        });
        return {
          context: {
            nextPageToken: res.nextPageToken,
          },
          options: res.items.map((taskList) => ({
            label: taskList.title,
            value: taskList.id,
          })),
        };
      },
    },
    taskId: {
      type: "string",
      label: "Task",
      description: "The ID of the task.",
      async options({
        prevContext,
        taskListId,
      }) {
        const res = await this.getTasks(this, {
          pageToken: prevContext.nextPageToken,
        }, taskListId);
        return {
          context: {
            nextPageToken: res.nextPageToken,
          },
          options: res.items.map((task) => ({
            label: task.title,
            value: task.id,
          })),
        };
      },
    },
    completed: {
      type: "boolean",
      label: "Completed",
      description: "Mark as `true` if your task is already completed.",
    },
    due: {
      type: "string",
      label: "Due",
      description: "Due date of the task (as a [RFC 3339](https://en.wikipedia.org/wiki/ISO_8601) timestamp). Optional. The due date only records date information; the time portion of the timestamp is discarded when setting the due date. It isn't possible to read or write the time that a task is due via the API.",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://tasks.googleapis.com/tasks/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getRequestParams(opts = {}) {
      if (!opts.path) {
        throw new Error("Missing path");
      }
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async paginate(fn, params, ...rest) {
      let data = [];
      let nextPageToken = null;
      const TOTAL_MAX_RESULTS = Math.min(params.maxResults, 1000);
      const ITEMS_PER_PAGE = Math.min(params.maxResults, 50);
      do {
        const pageResult = await fn(this, {
          ...params,
          maxResults: ITEMS_PER_PAGE,
          pageToken: nextPageToken,
        }, ...rest);
        nextPageToken = pageResult.nextPageToken;
        data.push(...pageResult.items);
        if (data.length >= TOTAL_MAX_RESULTS) {
          data = data.slice(0, TOTAL_MAX_RESULTS);
          break;
        }
      } while (nextPageToken);
      return data;
    },
    async getTaskLists(ctx = this, params = {}) {
      return axios(ctx, this._getRequestParams({
        path: "/users/@me/lists",
        method: "GET",
        params,
      }));
    },
    async insertTaskList(ctx = this, data) {
      return axios(ctx, this._getRequestParams({
        path: "/users/@me/lists",
        method: "POST",
        data,
      }));
    },
    async updateTaskList(ctx = this, data) {
      return axios(ctx, this._getRequestParams({
        path: `/users/@me/lists/${data.id}`,
        method: "PUT",
        data,
      }));
    },
    async deleteTaskList(ctx = this, id) {
      return axios(ctx, this._getRequestParams({
        path: `/users/@me/lists/${id}`,
        method: "DELETE",
      }));
    },
    async insertTask(ctx = this, taskListId, data) {
      return axios(ctx, this._getRequestParams({
        path: `/lists/${taskListId}/tasks`,
        method: "POST",
        data,
      }));
    },
    async getTasks(ctx = this, params, taskListId) {
      return axios(ctx, this._getRequestParams({
        path: `/lists/${taskListId}/tasks`,
        method: "GET",
        params,
      }));
    },
    async updateTask(ctx = this, taskListId, taskId, data) {
      return axios(ctx, this._getRequestParams({
        path: `/lists/${taskListId}/tasks/${taskId}`,
        method: "PUT",
        data,
      }));
    },
    async deleteTask(ctx = this, taskListId, taskId) {
      return axios(ctx, this._getRequestParams({
        path: `/lists/${taskListId}/tasks/${taskId}`,
        method: "DELETE",
      }));
    },
  },
};
