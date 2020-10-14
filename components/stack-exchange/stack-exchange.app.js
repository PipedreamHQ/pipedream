const _ = require("lodash");
const axios = require("axios");

module.exports = {
  type: "app",
  app: "stack_exchange",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site",
      description: "The StackExchange site for which questions are of interest",
      async options(context) {
        if (context.page !== 0) {
          // The `sites` API is not paginated:
          // https://api.stackexchange.com/docs/sites
          return {
            options: []
          };
        }

        const url = this._sitesUrl();
        const { data } = await axios.get(url);
        const rawOptions = data.items.map(site => ({
          label: site.name,
          value: site.api_site_parameter,
        }));
        const options = _.sortBy(rawOptions, ['label']);
        return {
          options,
        };
      },
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Keywords to search for in questions",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.stackexchange.com/2.2";
    },
    _sitesUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/sites`;
    },
    _advancedSearchUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/search/advanced`;
    },
    _authToken() {
      return this.$auth.oauth_access_token
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
    async *advancedSearch(baseParams) {
      const url = this._advancedSearchUrl();
      const baseRequestConfig = this._makeRequestConfig();
      let page = 1;
      let hasMore = false;
      do {
        const params = {
          ...baseParams,
          page,
        };
        const requestConfig = {
          ...baseRequestConfig,
          params,
        };
        const { data } = await axios.get(url, requestConfig);
        if (data.items.length === 0) {
          console.log(`
            No new questions found for the following parameters:
            ${JSON.stringify(baseParams, null, 2)}
          `);
        } else {
          console.log(`Found ${data.items.length} new question(s)`);
        }
        for (const item of data.items) {
          yield item;
        }
        hasMore = data.has_more;
        ++page;
      } while (hasMore);
    },
  },
};
