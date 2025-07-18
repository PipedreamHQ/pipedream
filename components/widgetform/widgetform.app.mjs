import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "widgetform",
  propDefinitions: {
    form: {
      type: "string",
      label: "Form",
      description: "Filter results by form name",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://usewidgetform.com/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": this.$auth.api_key,
        },
        ...otherOpts,
      });
    },
    listResponses(opts = {}) {
      return this._makeRequest({
        path: "/hooks/zapier/responses",
        ...opts,
      });
    },
    createSubscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks/zapier/subscription",
        ...opts,
      });
    },
    deleteSubscription(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/hooks/zapier/subscription",
        ...opts,
      });
    },
  },
};
