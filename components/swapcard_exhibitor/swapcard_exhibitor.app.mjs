import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";
import { queries } from "./common/queries.mjs";

export default {
  type: "app",
  app: "swapcard_exhibitor",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event to monitor for new connections (leads).",
      async options({ page }) {
        const { data: { events } } = await this.listEvents({
          page: page + 1,
          pageSize: LIMIT,
        });

        return events.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://developer.swapcard.com/event-admin/graphql";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Authorization": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl(),
        headers: this._headers(),
        ...opts,
      });
    },
    listEvents(variables) {
      return this._makeRequest({
        data: {
          query: queries.events,
          variables,
        },
      });
    },
    async getEventPeople(variables) {
      return this._makeRequest({
        data: {
          query: queries.eventPerson,
          variables,
        },
      });
    },
    async *paginate({
      fn, maxResults = null, type, ...variables
    }) {
      let hasMore = false;
      let count = 0;
      let cursor;

      do {
        variables.cursor = {
          first: LIMIT,
          after: cursor,
        };
        const {
          data: {
            [type]: {
              nodes, pageInfo,
            },
          },
        } = await fn(
          variables,
        );

        for (const node of nodes) {
          yield node;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        cursor = pageInfo.endCursor;

      } while (hasMore);
    },
  },
};
