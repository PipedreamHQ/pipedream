import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "diffbot",
  propDefinitions: {
    name: {
      type: "string",
      label: "Entity Name",
      description: "The name of the entity to enhance",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL to extract or enhance",
      optional: true,
    },
    location: {
      type: "string",
      label: "Entity location",
      description: "Location of the entity to enhance",
      optional: true,
    },
    type: {
      type: "string",
      label: "Entity type",
      description: "Diffbot entity type",
      options: [
        "person",
        "organization",
      ],
    },
  },
  methods: {
    _baseUrl(base) {
      return `https://${base}.diffbot.com`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        base,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(base) + path,
        params: {
          ...params,
          token: `${this.$auth.api_token}`,
        },
      });
    },
    async enhanceEntity(args = {}) {
      return this._makeRequest({
        method: "post",
        base: "kg",
        path: "/kg/v3/enhance",
        ...args,
      });
    },
    async extractPage(args = {}) {
      return this._makeRequest({
        base: "api",
        path: "/v3/analyze",
        ...args,
      });
    },
  },
};
