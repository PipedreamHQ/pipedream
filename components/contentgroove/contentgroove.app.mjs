import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "contentgroove",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.contentgroove.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitMediaProcessedEvent() {
      // Assuming there's an endpoint to check the status of media processing
      // and emit an event when processing is done. The actual implementation
      // would depend on the ContentGroove API capabilities which are not detailed.
      return this._makeRequest({
        path: "/media/processed", // Example path, replace with actual API endpoint if different
        method: "POST",
      });
    },
    async checkMediaStatus(mediaId) {
      return this._makeRequest({
        path: `/media/${mediaId}/status`,
      });
    },
    async listProcessedMedia({ page = 0 } = {}) {
      const response = await this._makeRequest({
        path: `/media/processed?page=${page}`,
      });

      // Assuming the API returns an array of media objects and a `hasMore` flag
      return {
        media: response.media,
        hasMore: response.hasMore,
      };
    },
    async paginate(fn, ...opts) {
      let page = 0;
      let hasMore = true;
      const allItems = [];

      while (hasMore) {
        const {
          media, hasMore: nextHasMore,
        } = await fn.call(this, {
          page,
          ...opts,
        });
        allItems.push(...media);
        hasMore = nextHasMore;
        page += 1;
      }

      return allItems;
    },
  },
};
