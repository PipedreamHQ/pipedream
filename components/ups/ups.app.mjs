import { axios } from "@pipedream/platform";
import { v4 as uuidv4 } from "uuid";

export default {
  type: "app",
  app: "ups",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      //return "https://onlinetools.ups.com/api";
      return "https://wwwcie.ups.com/api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          transactionsrc: "@PipedreamHQ/pipedream v0.1",
          transid: uuidv4(),
        },
        ...opts,
      });
    },
    getTrackingInfo({
      trackingNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/track/v1/details/${trackingNumber}`,
        ...opts,
      });
    },
    createShipment({
      version = "v2409", ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/shipments/${version}/ship`,
        ...opts,
      });
    },
  },
};
