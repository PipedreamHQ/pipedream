import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "simple_analytics",
  propDefinitions: {
    hostname: {
      type: "string",
      label: "Hostname",
      description: "The website's hostname, e.g. `example.com`. Use **List Websites** to find it (the `hostname` field).",
      async options() {
        const { websites } = await this.listWebsites();
        return websites.map(({ hostname }) => hostname);
      },
    },
  },
  methods: {
    _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: "https://simpleanalytics.com",
        headers: {
          "Api-Key": this.$auth.api_key,
          ...headers,
        },
        ...args,
      });
    },
    /**
     * Fetch the websites in the account. This Admin API call also needs the user ID.
     * @param {object} [args] - Request options, such as `$`
     * @returns {Promise<object>} The response, with records in `websites`
     */
    listWebsites({
      headers, ...args
    } = {}) {
      return this._makeRequest({
        url: "/api/websites",
        headers: {
          "User-Id": this.$auth.user_id,
          ...headers,
        },
        ...args,
      });
    },
    /**
     * Fetch aggregated statistics for one website.
     * @param {object} opts
     * @param {string} opts.hostname - The website's hostname
     * @returns {Promise<object>} The statistics
     */
    getStats({
      hostname, ...args
    }) {
      return this._makeRequest({
        url: `/${hostname}.json`,
        ...args,
      });
    },
  },
};
