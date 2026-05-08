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
    /**
     * Return the base URL for Luma's public API.
     */
    _baseUrl() {
      return "https://public-api.luma.com/v1";
    },
    /**
     * Build the headers required for authenticated Luma API requests.
     */
    _headers() {
      return {
        "Content-Type": "application/json",
        "x-luma-api-key": this.$auth.api_key,
      };
    },
    /**
     * Make an authenticated request to the Luma public API.
     *
     * @param {object} args - Axios request arguments.
     * @returns {Promise<object>} The parsed API response.
     */
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
    /**
     * List events managed by the connected Luma calendar.
     *
     * @param {object} args - Request arguments, including optional query params.
     * @returns {Promise<object>} The Luma list events response.
     */
    listEvents(args = {}) {
      return this._makeRequest({
        path: "/calendar/list-events",
        ...args,
      });
    },
    /**
     * Get admin details for a managed Luma event.
     *
     * @param {object} args - Request arguments.
     * @param {string} args.eventId - The Luma event ID.
     * @returns {Promise<object>} The Luma get event response.
     */
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
    /**
     * Create an event on the connected Luma calendar.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.data - Luma event creation payload.
     * @returns {Promise<object>} The Luma create event response.
     */
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
    /**
     * List guests for a Luma event.
     *
     * @param {object} args - Request arguments, including required event query params.
     * @returns {Promise<object>} The Luma get guests response.
     */
    getGuests(args = {}) {
      return this._makeRequest({
        path: "/event/get-guests",
        ...args,
      });
    },
    /**
     * Get a guest by guest ID, ticket key, guest key, or email.
     *
     * @param {object} args - Request arguments.
     * @param {string} args.eventId - The Luma event ID.
     * @param {string} args.guestId - Guest identifier accepted by Luma.
     * @returns {Promise<object>} The Luma get guest response.
     */
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
    /**
     * List ticket types for a Luma event.
     *
     * @param {object} args - Request arguments, including required event query params.
     * @returns {Promise<object>} The Luma list ticket types response.
     */
    listTicketTypes(args = {}) {
      return this._makeRequest({
        path: "/event/ticket-types/list",
        ...args,
      });
    },
    /**
     * Add guests to a Luma event with status Going.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.data - Luma add guests payload.
     * @returns {Promise<object>} The Luma add guests response.
     */
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
    /**
     * Send invitations for a Luma event.
     *
     * @param {object} args - Request arguments.
     * @param {object} args.data - Luma send invites payload.
     * @returns {Promise<object>} The Luma send invites response.
     */
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
