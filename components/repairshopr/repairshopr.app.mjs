import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "repairshopr",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return `${this._getSubdomain()}/api/v1`;
    },
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getSubdomain() {
      return this.$auth.subdomain;
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
    async createCustomer(data, ctx = this) {
      return this._makeHttpRequest(
        {
          path: "/customers",
          method: "POST",
          data,
        },
        ctx,
      );
    },
  },
};

/*
COPY THIS KEY
We do not store API Tokens in plain text. You will not be able to
see this message again. Please copy the token and store it.

T9c1651f479258b728-0f1099961fd36d608dcab57111f0f915
Owner
Cassiano
Created at
Wed 11-30-22 04:17 AM
Type
Custom
Expires at
 01-13-23
Partial Key
T9c1651f479258b728-***
*/
