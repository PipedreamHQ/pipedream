import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "emailable",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email you want to verify",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "A list of emails to verify in batch (up to 50,000)",
    },
    url: {
      type: "string",
      label: "URL",
      description: "A URL that will receive the batch results via HTTP POST",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.emailable.com/v1${path}`;
    },
    getAuthParams(data) {
      return {
        api_key: this.$auth.api_key,
        ...data,
      };
    },
    _makeRequest({
      $ = this, path, data, params, ...args
    } = {}) {
      const {
        getUrl,
        getAuthParams,
      } = this;

      const config = {
        url: getUrl(path),
        params: getAuthParams(params),
        data: getAuthParams(data),
        ...args,
      };

      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
