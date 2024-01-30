import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stammer_ai",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "The text message you want to send to the chatbot.",
    },
    apiToken: {
      type: "string",
      label: "API Token",
      description: "Your Stammer.ai API token for authentication.",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.stammer.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Token ${this.apiToken}`,
        },
        data,
        params,
      });
    },
    async sendMessage({ message }) {
      return this._makeRequest({
        method: "POST",
        path: "/en/api/v1/chatbot/message/",
        data: {
          message,
        },
      });
    },
    async getUserData() {
      return this._makeRequest({
        path: "/en/user/api/v1/me/",
      });
    },
  },
  version: "0.0.1",
};
