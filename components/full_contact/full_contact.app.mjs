import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "full_contact",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.fullcontact.com/v3";
    },
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._getApiKey()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async enrichPerson(data, ctx = this) {
      return this._makeHttpRequest(
        {
          path: "/person.enrich",
          method: "POST",
          data,
        },
        ctx,
      );
    },
  },
};

// hJpgHZEGuXUj2XoQJHPciEn1lamlWZ2a
