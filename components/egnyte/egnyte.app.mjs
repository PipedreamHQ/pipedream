import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "egnyte",
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.egnyte.com/pubapi/v1`;
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($ || this, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({ hookId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
    createFolder({ folderPath }) {
      return this._makeRequest({
        method: "POST",
        path: `/fs/${folderPath}`,
        data: {
          action: "add_folder",
        },
      });
    },
    uploadFile({
      folderPath, filename, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/fs-content/${folderPath}/${filename}`,
        ...opts,
      });
    },
  },
};
