import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "evenium",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event",
      async options({ page }) {
        const { events } = await this.listEvents({
          params: {
            firstResult: (page - 1) * LIMIT,
            maxResults: LIMIT,
          },
        });

        return events?.map((event) => ({
          label: `${event.title} (${event.id})`,
          value: event.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://evenium.com/api/1";
    },
    _getHeaders(headers = {}) {
      return {
        "X-Evenium-Token": this.$auth.access_token,
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...otherConfig
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(headers),
        ...otherConfig,
      });
    },
    createEvent({
      data, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/events",
        data,
        ...opts,
      });
    },
    listEvents(opts = {}) {
      return this._makeRequest({
        path: "/events",
        ...opts,
      });
    },
    createGuest({
      eventId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/events/${eventId}/guests`,
        ...opts,
      });
    },
    listGuests({
      eventId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/events/${eventId}/guests`,
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
        params.firstResult = page * LIMIT;
        params.maxResults = LIMIT;

        const {
          [dataField]: data,
          more,
        } = await fn({
          params,
          ...opts,
        });

        for (const d of data || []) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }
        hasMore = more;
      } while (hasMore);
    },
  },
};
