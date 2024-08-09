import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dart",
  propDefinitions: {
    dartboardId: {
      type: "string",
      label: "Dartboard ID",
      description: "The dartboard where the task is or will be located",
      async options({ page }) {
        const { results } = await this.listDartboards({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return results?.map(({
          duid: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    assigneeIds: {
      type: "string[]",
      label: "Assigned To",
      description: "The user(s) the task is assigned to",
      optional: true,
      async options({ page }) {
        const { results } = await this.listUsers({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return results?.map(({
          duid: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({ page }) {
        const { results } = await this.listTasks({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return results?.map(({
          duid: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
    },
    taskDescription: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    dueAt: {
      type: "string",
      label: "Due Date",
      description: "The due date for the task in ISO-8601 format. Example: `2024-06-25T15:43:49.214Z`",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the task",
      optional: true,
      options: constants.TASK_PRIORITIES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.itsdart.com/api/v0";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    listDocs(opts = {}) {
      return this._makeRequest({
        path: "/docs",
        ...opts,
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...opts,
      });
    },
    listDartboards(opts = {}) {
      return this._makeRequest({
        path: "/dartboards",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    createTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transactions/create",
        ...opts,
      });
    },
    async *paginate({
      resourceFn, params, max,
    }) {
      let total, count = 0;
      params = {
        ...params,
        limit: constants.DEFAULT_LIMIT,
        offset: 0,
      };
      do {
        const { results } = await resourceFn({
          params,
        });
        total = results?.length;
        for (const item of results) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
          params.offset += params.limit;
        }
      } while (total);
    },
  },
};
