import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "foursquare",
  propDefinitions: {
    venueId: {
      type: "string",
      label: "Venue ID",
      description: "The ID of the venue where you want to interact.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.foursquare.com/v2";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, params = {}, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        params: {
          ...params,
          v: "20240430",
        },
        ...opts,
      });
    },
    createCheckIn(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/checkins/add",
        ...opts,
      });
    },
    addTip(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tips/add",
        ...opts,
      });
    },
    getUserTips(opts = {}) {
      return this._makeRequest({
        path: "/users/self/tips",
        ...opts,
      });
    },
    getUserCheckins(opts = {}) {
      return this._makeRequest({
        path: "/users/self/checkins",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, dataField, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;

        const { response } = await fn({
          params,
          ...opts,
        });

        const items = response[dataField].items;

        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
