const axios = require("axios");
const parseLinkHeader = require("parse-link-header");

module.exports = {
  type: "app",
  app: "sentry",
  propDefinitions: {
    organizationSlug: {
      type: "string",
      label: "Organization",
      description: "The organization for which to consider issues events",
      async options(context) {
        const url = this._organizationsEndpoint();
        const params = {};  // We don't need to provide query parameters at the moment.
        const { data, next } = await this._propDefinitionsOptions(url, params, context);
        const options = data.map(this._organizationObjectToOption);
        return {
          options,
          context: {
            nextPage: next,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://sentry.io/api/0";
    },
    _organizationsEndpoint() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/organizations/`;
    },
    _organizationObjectToOption(organization) {
      const { name, slug } = organization;
      const label = `${name} (${slug})`;
      return {
        label,
        value: slug,
      };
    },
    _authToken() {
      return this.$auth.auth_token;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    async _propDefinitionsOptions(url, params, { page, prevContext }) {
      let requestConfig = this._makeRequestConfig();  // Basic axios request config
      if (page === 0) {
        // First time the options are being retrieved.
        // Include the parameters provided, which will be persisted
        // across the different pages.
        requestConfig = {
          ...requestConfig,
          params,
        };
      } else if (prevContext.nextPage) {
        // Retrieve next page of options.
        url = prevContext.nextPage.url;
      } else {
        // No more options available.
        return { data: [] };
      }

      const {
        data,
        headers: { link },
      } = await axios.get(url, requestConfig);
      // https://docs.sentry.io/api/pagination/
      const { next } = parseLinkHeader(link);

      return {
        data,
        next,
      };
    },
  },
};
