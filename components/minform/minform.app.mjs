import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "minform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to get submissions for. Use the **List Forms** action to get the form ID.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://minform.io/api/pipedream";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/hooks",
        ...args,
      });
    },
    listForms(args = {}) {
      return this._makeRequest({
        path: "/forms",
        ...args,
      });
    },
    listSubmissions(args = {}) {
      return this._makeRequest({
        path: "/results",
        ...args,
      });
    },
  },
};
