import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "humanitix",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The unique identifier of the event",
      async options({ page }) {
        const { events } = await this.getEvents({
          params: {
            page: page + 1,
          },
        });
        return events.map((event) => ({
          label: event.name,
          value: event._id,
        }));
      },
    },
    overrideLocation: {
      type: "string",
      label: "Override Location",
      description: "By default, queries will be made with the user location. Use this parameter to override the user location for these requests. Format is that of ISO 3166-1 alpha-2 country codes",
      optional: true,
    },
    since: {
      type: "string",
      label: "Since",
      description: "Results since this date-time (ISO 8601). E.g. `2021-02-01T23:26:13.485Z`",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.humanitix.com/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
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
    getEvents(opts = {}) {
      return this._makeRequest({
        path: "/events",
        ...opts,
      });
    },
    getOrders({
      eventId, ...opts
    }) {
      return this._makeRequest({
        path: `/events/${eventId}/orders`,
        ...opts,
      });
    },
    getTickets({
      eventId, ...opts
    }) {
      return this._makeRequest({
        path: `/events/${eventId}/tickets`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, dataField, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const { [dataField]: data } = await fn({
          params,
          ...opts,
        });

        for (const d of data || []) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data && data.length;

      } while (hasMore);
    },
  },
};
