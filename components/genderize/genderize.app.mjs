import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "genderize",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name that will be checked",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.genderize.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        params: {
          api_key: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },
    async getGenderFromName(args = {}) {
      return this._makeRequest({
        ...args,
      });
    },
  },
};
