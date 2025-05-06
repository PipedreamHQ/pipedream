import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "notiff_io",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the notification.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The content/description of the notification.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL associated with the notification.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://notiff.io/api/1.1/wf";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createNotification(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create_notification",
        ...opts,
      });
    },
  },
};
