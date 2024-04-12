import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "autobound",
  propDefinitions: {
    sender: {
      type: "string",
      label: "Sender",
      description: "The identifier of the sender, either `userEmail` or `userLinkedinUrl`",
      optional: false,
    },
    receiver: {
      type: "string",
      label: "Receiver",
      description: "The identifier of the receiver, either `contactEmail` or `contactLinkedinUrl`",
      optional: false,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The content of the message to send",
      optional: false,
    },
    context: {
      type: "string",
      label: "Context",
      description: "The setting or occasion of the message",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://autobound-api.readme.io/docs/v3-autobound-api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async composeMessage(opts = {}) {
      return this._makeRequest({
        path: "/",
        data: {
          contactEmail: opts.receiver,
          userEmail: opts.sender,
          message: opts.message,
          context: opts.context,
        },
        ...opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
