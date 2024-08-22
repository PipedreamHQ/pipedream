import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "genderapi_io",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name to be checked",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email to be checked",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country filter",
      options: constants.COUNTRY_CODES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.genderapi.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          ...params,
          key: `${this.$auth.api_key}`,
        },
      });
    },
    async nameToGender(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/",
        ...args,
      });
    },
    async emailToGender(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/email/",
        ...args,
      });
    },
  },
};
