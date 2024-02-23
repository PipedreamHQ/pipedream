import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "faraday",
  propDefinitions: {
    targetId: {
      type: "string",
      label: "Target ID",
      description: "The ID of the target to use for the prediction",
      async options() {
        const targets = await this.listTargets();
        return targets?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.faraday.ai/v1";
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    listTargets(opts = {}) {
      return this._makeRequest({
        path: "/targets",
        ...opts,
      });
    },
    generatePrediction({
      targetId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/targets/${targetId}/lookup`,
        ...opts,
      });
    },
  },
};
