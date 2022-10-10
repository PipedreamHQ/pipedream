import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "customer_io",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer.",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://track.customer.io/api/v1";
    },
    _getHeaders() {
      const basicauthUserPwd = `${this.$auth.site_id}:${this.$auth.api_key}`;
      const buff = Buffer.from(basicauthUserPwd);
      const base64BasicauthUserPwd = buff.toString("base64");

      return {
        "Content-Type": "application/json",
        "Authorization": `Basic ${base64BasicauthUserPwd}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    createOrUpdateCustomer(customerId, data, $ = this) {
      return axios($, this._getAxiosParams({
        method: "PUT",
        path: `/customers/${customerId}`,
        data,
      }));
    },
  },
};
