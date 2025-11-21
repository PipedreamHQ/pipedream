import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dart",
  propDefinitions: {
    dartboard: {
      type: "string",
      label: "Dartboard",
      description: "The dartboard where the task is or will be located",
      optional: true,
      async options() {
        const { dartboards } = await this.getConfig();
        return dartboards?.map((dartboard) => dartboard) || [];
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
          email: value, name: label,
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
      optional: true,
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
    docId: {
      type: "string",
      label: "Doc ID",
      description: "The ID of the doc",
      async options({ page }) {
        const { results } = await this.listDocs({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return results?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags of the task",
      optional: true,
      async options() {
        const { tags } = await this.getConfig();
        return tags?.map((tag) => tag) || [];
      },
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the task",
      optional: true,
      async options() {
        const { priorities } = await this.getConfig();
        return priorities?.map((priority) => priority) || [];
      },
    },
    size: {
      type: "string",
      label: "Size",
      description: "The size of the task",
      optional: true,
      async options() {
        const { sizes } = await this.getConfig();
        return sizes?.map((size) => size) || [];
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task",
      optional: true,
      async options() {
        const { statuses } = await this.getConfig();
        return statuses?.map((status) => status) || [];
      },
    },
    type: {
      type: "string",
      label: "Type",
      description: "The title of the type of the task",
      optional: true,
      async options() {
        const { types } = await this.getConfig();
        return types.map((type) => type);
      },
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task",
    },
    startAt: {
      type: "string",
      label: "Start At",
      description: "The start date, which is a date that the task should be started by in ISO format, like YYYY-MM-DD",
      optional: true,
    },
    dueAt: {
      type: "string",
      label: "Due Date",
      description: "The due date for the task in ISO format, like YYYY-MM-DD",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title, which is a short description of what needs to be done",
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "The full title of the folder, which is a project or list of docs",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The full content of the doc, which can include markdown formatting",
      optional: true,
    },
    customProperties: {
      type: "object",
      label: "Custom Properties",
      description: "The custom properties, which is an object of custom properties that are associated with the task",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.dartai.com/api/v0";
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
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/public/tasks",
        ...opts,
      });
    },
    updateTask(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/public/tasks/${opts.data.item.id}`,
        ...opts,
      });
    },
    getConfig(opts = {}) {
      return this._makeRequest({
        path: "/public/config",
        ...opts,
      });
    },
    getDartboard({ dartboardId }) {
      return this._makeRequest({
        path: `/public/dartboards/${dartboardId}`,
      });
    },
    createDoc(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/public/docs",
        ...opts,
      });
    },
    updateDoc(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/public/docs/${opts.data.item.id}`,
        ...opts,
      });
    },
    deleteDoc({
      docId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/public/docs/${docId}`,
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
