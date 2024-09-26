import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whatsable",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to send the message to, in E164 format (e.g., +34677327718). Hyphens will be removed if included.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to the phone number.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://dashboard.whatsable.app/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": this.$auth.api_key,
        },
      });
    },
    async sendMessage(args = {}) {
      return this._makeRequest({
        path: "/whatsapp/messages/send",
        method: "post",
        ...args,
      });
    },
  },
};
