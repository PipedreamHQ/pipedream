import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mintlify",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain identifier from your domain.mintlify.app URL. Can be found in the top left of your dashboard.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-dsc.mintlify.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.assistant_api_key}`,
        },
        ...opts,
      });
    },
    triggerUpdate(opts = {}) {
      return this._makeRequest({
        url: `https://api.mintlify.com/v1/project/update/${this.$auth.project_id}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.$auth.admin_api_key}`,
        },
        ...opts,
      });
    },
    searchDocumentation({
      domain, ...opts
    }) {
      return this._makeRequest({
        path: `/search/${domain}`,
        method: "POST",
        ...opts,
      });
    },
    chatWithAssistant({
      domain, ...opts
    }) {
      return this._makeRequest({
        path: `/assistant/${domain}/message`,
        method: "POST",
        ...opts,
      });
    },
  },
};
