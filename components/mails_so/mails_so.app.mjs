import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mails_so",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email to validate",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mails.so/v1";
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
          "x-mails-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    async validateEmail(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/validate",
        ...args,
      });
    },
  },
};
