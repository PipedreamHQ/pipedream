import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "noor",
  propDefinitions: {
    thread: {
      type: "string",
      label: "Thread",
      description: "Thread to where the message will be sent",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text of the message",
    },
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "ID of the space, can be viewed in your space settings",
    },
  },
  methods: {
    _baseUrl() {
      return "https://sun.noor.to/api/v0";
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async sendMessage(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/sendMessage",
        ...args,
      });
    },
  },
};
