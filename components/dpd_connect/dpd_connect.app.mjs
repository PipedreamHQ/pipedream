import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dpd_connect",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.dpdconnect.nl/api/connect/v1";
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    getParcelStatus({
      parcelNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/parcel/status/${parcelNumber}`,
        ...opts,
      });
    },
  },
};
