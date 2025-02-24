import { LinkupClient } from "linkup-sdk";

export default {
  type: "app",
  app: "linkup",
  propDefinitions: {},
  methods: {
    _getClient() {
      return new LinkupClient({
        apiKey: this.$auth.api_key,
      });
    },
    search(params) {
      const client = this._getClient();
      return client.search(params);
    },
  },
};
