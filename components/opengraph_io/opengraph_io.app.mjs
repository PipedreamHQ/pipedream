import opengraph from "opengraph-io";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "opengraph_io",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "Site URL to scrape",
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description: "Array of properties to retrieve",
      options: constants.PROPERTY_OPTIONS,
    },
  },
  methods: {
    _client() {
      return opengraph({
        appId: this.$auth.api_key,
      });
    },
    async getSiteInfo(url) {
      const client = this._client();
      return client.getSiteInfo(url);
    },
  },
};
