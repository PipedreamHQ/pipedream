import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "muna",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "Prediction client identifier",
      async options({ tag }) {
        const { targets } = await this.getPredictor({
          tag,
        });
        return targets;
      },
    },
  },
  methods: {
    getBaseUrl() {
      return "https://api.muna.ai/v1";
    },
    getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    makeRequest({
      $ = this,
      path,
      ...args
    } = {}) {
      return axios($, {
        url: `${this.getBaseUrl()}${path}`,
        headers: this.getHeaders(),
        ...args,
      });
    },
    getPredictor({
      tag, ...args
    }) {
      return this.makeRequest({
        path: `/predictors/${tag}`,
        ...args,
      });
    },
    createPrediction(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/predictions",
        ...args,
      });
    },
  },
};
