import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bunnycdn",
  propDefinitions: {
    pullZoneId: {
      type: "integer",
      label: "Pull Zone ID",
      description: "The ID of the pull zone, e.g. `123456`. Use **List Pull Zones** to find it (the `Id` field).",
      async options({ prevContext }) {
        if (prevContext?.done) {
          return [];
        }
        const {
          Items: pullZones,
          CurrentPage: currentPage,
          HasMoreItems: hasMore,
        } = await this.listPullZones({
          params: {
            page: prevContext?.page ?? 1,
          },
        });
        return {
          options: pullZones.map(({
            Id: value, Name: label,
          }) => ({
            label,
            value,
          })),
          context: hasMore
            ? {
              page: currentPage + 1,
            }
            : {
              done: true,
            },
        };
      },
    },
  },
  methods: {
    _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: "https://api.bunny.net",
        headers: {
          AccessKey: this.$auth.api_key,
          ...headers,
        },
        ...args,
      });
    },
    /**
     * Fetch one page of pull zones. Set `params.page` to 1 or higher: without it the API
     * returns a plain array instead of a page.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} A page with `Items`, `CurrentPage` and `HasMoreItems`
     */
    listPullZones(args = {}) {
      return this._makeRequest({
        url: "/pullzone",
        ...args,
      });
    },
    /**
     * Fetch pull zones across pages, up to a limit.
     * Starts at page 1, because the API only returns a page for a page number of 1 or higher.
     * @param {object} opts
     * @param {number} [opts.maxResults=100] - The most pull zones to return
     * @param {object} [opts.params] - Query params sent with each request
     * @returns {Promise<object[]>} The pull zones
     */
    async getAllPullZones({
      maxResults = 100, params, ...args
    }) {
      const pullZones = [];
      let page = 1;
      let hasMore = true;
      while (hasMore && pullZones.length < maxResults) {
        const {
          Items: items,
          CurrentPage: currentPage,
          HasMoreItems: hasMoreItems,
        } = await this.listPullZones({
          ...args,
          params: {
            ...params,
            page,
          },
        });
        pullZones.push(...items);
        page = currentPage + 1;
        hasMore = hasMoreItems && items.length > 0;
      }
      return pullZones.slice(0, maxResults);
    },
    /**
     * Fetch one pull zone.
     * @param {object} opts
     * @param {number} opts.pullZoneId - The pull zone ID
     * @returns {Promise<object>} The pull zone
     */
    getPullZone({
      pullZoneId, ...args
    }) {
      return this._makeRequest({
        url: `/pullzone/${pullZoneId}`,
        ...args,
      });
    },
    /**
     * Fetch traffic statistics.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} The statistics
     */
    getStatistics(args = {}) {
      return this._makeRequest({
        url: "/statistics",
        ...args,
      });
    },
    /**
     * Purge the cache of a pull zone.
     * @param {object} opts
     * @param {number} opts.pullZoneId - The pull zone ID
     * @returns {Promise<string>} An empty response body
     */
    purgePullZoneCache({
      pullZoneId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/pullzone/${pullZoneId}/purgeCache`,
        ...args,
      });
    },
    /**
     * Purge one URL from the cache.
     * @param {object} [args] - Request options, with the URL in `params.url`
     * @returns {Promise<string>} An empty response body
     */
    purgeUrl(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/purge",
        ...args,
      });
    },
  },
};
