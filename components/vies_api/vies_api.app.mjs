import VIESAPI from "viesapi-client";

export default {
  type: "app",
  app: "vies_api",
  methods: {
    _client() {
      return new VIESAPI.VIESAPIClient();
    },
    getVATData({ number }) {
      return this._client().getVIESData(number);
    },
  },
};
