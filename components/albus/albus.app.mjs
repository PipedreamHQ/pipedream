import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "albus",
  propDefinitions: {
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The question to ask",
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the answer is ready",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-albus.springworks.in";
    },
    makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    chatCompletion(opts = {}) {
      return this.makeRequest({
        method: "POST",
        path: "/chat/completions/custom",
        ...opts,
      });
    },
  },
};
