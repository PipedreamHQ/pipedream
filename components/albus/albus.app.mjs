import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "albus",
  propDefinitions: {
    file: {
      type: "string",
      label: "File",
      description: "The file to be trained",
    },
    settings: {
      type: "object",
      label: "Training Settings",
      description: "Specify the training settings",
      optional: true,
    },
    authKeys: {
      type: "string",
      label: "Auth Keys",
      description: "The authorization keys",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.albus.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async trainFile({
      file, settings,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/train",
        data: {
          file,
          settings,
        },
      });
    },
  },
};
