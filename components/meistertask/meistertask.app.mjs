import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "meistertask",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task",
      description: "Identifier of a task",
      async options({ page }) {
        const tasks = await this.listTasks({
          params: {
            page: page + 1,
          },
        }); console.log(tasks);
        return tasks?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.meistertask.com/api";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    createAttachment(taskId, args = {}) {
      return this._makeRequest({
        path: `/tasks/${taskId}/attachments`,
        method: "POST",
        ...args,
      });
    },
  },
};
