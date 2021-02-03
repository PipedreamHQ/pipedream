/* 
API docs: https://developer.uservoice.com/docs/api/v2/reference/
Getting Started Guide: https://developer.uservoice.com/docs/api/v2/getting-started/
*/

module.exports = {
  type: "app",
  app: "uservoice",
  methods: {
    _accessToken() {
      return this.$auth.access_token;
    },
    _apiUrl() {
      return `https://${this._subdomain()}.uservoice.com/api/v2`;
    },
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers.authorization = `Bearer ${this._accessToken()}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      return await require("@pipedreamhq/platform").axios(this, opts);
    },
    _subdomain() {
      return this.$auth.subdomain;
    },
    // https://developer.uservoice.com/docs/api/v2/reference/#operation/ListNpsRatings
    async listNPSRatings({ updated_after, maxResults }) {
      const npsRatings = [];
      let cursor;
      do {
        const { nps_ratings, pagination } = await this._makeRequest({
          path: "/admin/nps_ratings",
          params: {
            per_page: 100, // max allowed by API
            cursor,
            updated_after,
          },
        });
        npsRatings.push(...(nps_ratings || []));
        // When retrieving sample data, return early once we've fetched maxResults
        if (maxResults && npsRatings.length >= maxResults) {
          return maxResults.slice(0, maxResults);
        }
        cursor = pagination.cursor;
      } while (cursor);

      return npsRatings;
    },
  },
};
