import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export default {
  type: "app",
  app: "eventzilla",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event",
      async options({ page }) {
        const { events } = await this.listEvents({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        if (!events?.length) {
          return [];
        }
        return events.map((event) => ({
          label: event.title,
          value: event.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.eventzillaapi.net/api/v2";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listEvents(opts = {}) {
      return this._makeRequest({
        path: "/events",
        ...opts,
      });
    },
    listAttendees({
      eventId, ...opts
    }) {
      return this._makeRequest({
        path: `/events/${eventId}/attendees`,
        ...opts,
      });
    },
    listEventTransactions({
      eventId, ...opts
    }) {
      return this._makeRequest({
        path: `/events/${eventId}/transactions`,
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: MAX_LIMIT,
          offset: 0,
        },
      };
      let total, count = 0;
      do {
        const response = await fn(args);
        const items = resourceKey
          ? response[resourceKey]
          : response;
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        args.params.offset += args.params.limit;
        total = items?.length;
      } while (total === args.params.limit);
    },
    async getPaginatedResources(opts = {}) {
      const items = [];
      const results = this.paginate(opts);
      for await (const item of results) {
        items.push(item);
      }
      return items;
    },
  },
};
