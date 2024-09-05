import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vext",
  propDefinitions: {
    payload: {
      type: "string",
      label: "Payload",
      description: "This is the input that you'll be sending to your LLM pipeline",
    },
    longPolling: {
      type: "boolean",
      label: "Long Polling",
      description: "If your pipeline includes several models and you're facing timeout issues, enabling this option will generate a 'request_id' for you",
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "Include the long_polling request ID in the body to receive updates until the final result is delivered",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://payload.vextapp.com/hook/${this.$auth.endpoint_id}/catch/${this.$auth.channel_token}`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Apikey": `Api-key ${this.$auth.api_key}`,
        },
      });
    },
    async sendQuery(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "",
        ...args,
      });
    },
  },
};
