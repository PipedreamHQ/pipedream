import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hyperise",
  propDefinitions: {
    imageTemplateHash: {
      type: "string",
      label: "Image Template Hash",
      description: "The image hash of the template to use",
      async options() {
        const templates = await this.listTemplates();
        return templates?.map(({
          image_hash: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.hyperise.io/api/v1/regular";
    },
    _authParams(params) {
      return {
        ...params,
        api_token: `${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params,
      data,
      ...otherOpts
    }) {
      const config = {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
      };
      if (data) {
        config.data = this._authParams(data);
      } else {
        config.params = this._authParams(params);
      }
      return axios($, config);
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/image-templates",
        ...opts,
      });
    },
    getImageViews(opts = {}) {
      return this._makeRequest({
        path: "/image-impressions",
        ...opts,
      });
    },
    createPersonalisedShortUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/short-links",
        ...opts,
      });
    },
  },
};
