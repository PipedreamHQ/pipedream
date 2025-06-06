import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alttextify",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.alttextify.net/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`
        },
      });
    },
    async generateAltText(args) {
      return this._makeRequest({
        path: "/image/url",
        method: "POST",
        ...args,
      });
    },    
  },
};