import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "picdefense",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "URL of the image that is going to be checked",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.picdefense.io/api/v2";
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
          "X-API-TOKEN": `${this.$auth.user_id}:${this.$auth.api_key}`,
        },
      });
    },
    async checkImageRisk(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/checkImageRisk",
        ...args,
      });
    },
    async checkCredits(args = {}) {
      return this._makeRequest({
        path: "/credits",
        ...args,
      });
    },
  },
};
