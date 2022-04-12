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
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    insertTaskList(ctx = this, data) {
      return axios(ctx, this._getRequestParams({
        path: "/users/@me/lists",
        method: "POST",
        data,
      }));
    },
  },
};
