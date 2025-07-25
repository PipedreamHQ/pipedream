import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "harpa_ai",
  propDefinitions: {
    node: {
      type: "string",
      label: "Node",
      description: "A target Node ID which should run the command. If omitted, the first available Node will be used.",
      optional: true,
    },
    timeout: {
      type: "string",
      label: "Timeout",
      description: "Synchronous action execution timeout",
      optional: true,
    },
    resultsWebhook: {
      type: "string",
      label: "Results Webhook",
      description: "An asynchronous webhook URL to send the results to upon completion",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.harpa.ai/api/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-type": "application/json",
        },
        ...opts,
      });
    },
    sendAction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/grid",
        ...opts,
      });
    },
  },
};
