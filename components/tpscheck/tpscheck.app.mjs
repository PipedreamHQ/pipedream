import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tpscheck",
  propDefinitions: {
    phonenumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to be validated",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://www.tpscheck.uk/";
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
          "Authorization": `Token ${this.$auth.api_key}`,
        },
      });
    },
    async validateNumber(args = {}) {
      return this._makeRequest({
        path: "/check",
        method: "post",
        ...args,
      });
    },
  },
};
