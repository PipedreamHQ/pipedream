import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "refiner",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to identify or track events for.",
      async options({ page }) {
        const { items } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });

        return items.map(({
          uuid: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user to identify or track events for.",
      optional: true,
    },
    segmentId: {
      type: "string",
      label: "Segment ID",
      description: "The ID of the segment to emit events for.",
      async options({ page }) {
        const { items } = await this.listSegments({
          params: {
            page: page + 1,
          },
        });

        return items.map(({
          uuid: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.refiner.io/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listResponses(opts = {}) {
      return this._makeRequest({
        path: "/responses",
        ...opts,
      });
    },
    listSegments(opts = {}) {
      return this._makeRequest({
        path: "/segments",
        ...opts,
      });
    },
    identifyUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/identify-user",
        ...opts,
      });
    },
    trackEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/track-event",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          items,
          pagination: {
            current_page, last_page,
          },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = current_page < last_page;

      } while (hasMore);
    },
  },
};
