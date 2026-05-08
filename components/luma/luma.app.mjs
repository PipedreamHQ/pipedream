import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "luma",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The Luma event ID. Event IDs usually start with `evt-`.",
      async options({ prevContext }) {
        const cursor = prevContext?.cursor;
        const response = await this.listEvents({
          params: {
            pagination_cursor: cursor,
            pagination_limit: 50,
            sort_column: "start_at",
            sort_direction: "desc",
          },
        });
        const entries = response?.entries ?? [];
        const options = entries
          .map((entry) => entry?.event ?? entry)
          .filter((event) => event?.id || event?.api_id)
          .map((event) => ({
            label: event.start_at
              ? `${event.name ?? event.id ?? event.api_id} (${event.start_at})`
              : event.name ?? event.id ?? event.api_id,
            value: event.id ?? event.api_id,
          }));

        return {
          options,
          context: {
            cursor: response?.next_cursor,
          },
        };
      },
    },
    paginationCursor: {
      type: "string",
      label: "Pagination Cursor",
      description: "The `next_cursor` value from a previous Luma list response.",
      optional: true,
    },
    paginationLimit: {
      type: "integer",
      label: "Pagination Limit",
      description: "The number of items to request. Luma enforces a server-side maximum.",
      optional: true,
      default: 50,
      min: 1,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "The order to return records in.",
      optional: true,
      options: [
        "asc",
        "desc",
        "asc nulls last",
        "desc nulls last",
      ],
    },
    guestsJson: {
      type: "string",
      label: "Guests",
      description: "A JSON array of guests. Example: `[{\"email\":\"jane@example.com\",\"name\":\"Jane Doe\"}]`.",
    },
    maxPages: {
      type: "integer",
      label: "Max Pages",
      description: "The maximum number of pages to retrieve when fetching all pages.",
      optional: true,
      default: 10,
      min: 1,
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.luma.com/v1";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "x-luma-api-key": this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this,
      method = "GET",
      path,
      params,
      data,
      ...opts
    } = {}) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params,
        data,
        ...opts,
      });
    },
    listEvents(args = {}) {
      return this._makeRequest({
        path: "/calendar/list-events",
        ...args,
      });
    },
    getEvent({
      eventId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: "/event/get",
        params: {
          id: eventId,
        },
        ...args,
      });
    },
    createEvent({
      data,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/event/create",
        data,
        ...args,
      });
    },
    getGuests(args = {}) {
      return this._makeRequest({
        path: "/event/get-guests",
        ...args,
      });
    },
    getGuest({
      eventId,
      guestId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: "/event/get-guest",
        params: {
          event_id: eventId,
          id: guestId,
        },
        ...args,
      });
    },
    listTicketTypes(args = {}) {
      return this._makeRequest({
        path: "/event/ticket-types/list",
        ...args,
      });
    },
    addGuests({
      data,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/event/add-guests",
        data,
        ...args,
      });
    },
    sendInvites({
      data,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/event/send-invites",
        data,
        ...args,
      });
    },
  },
};
