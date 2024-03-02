import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "thoughtful_gpt",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.thoughtfulgpt.com/api";
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
          "X-Api-Key": `${this.$auth.relay_api_token}`,
        },
      });
    },
    processContent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/automations/zapier/webhook/transcript/",
        ...opts,
      });
    },
    analyzeCSV(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/automations/zapier/webhook/process-csv/",
        ...opts,
      });
    },
  },
};
