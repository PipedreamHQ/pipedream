import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "ticket_source",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The unique identifier of the event",
      async options({ page }) {
        const { data } = await this.listEvents({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id, attributes: { name },
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    eventDate: {
      type: "string",
      label: "Event Date ID",
      description: "The unique identifier of the event date",
      async options({
        eventId, page,
      }) {
        const { data } = await this.listEventDates({
          eventId,
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id, attributes: { start },
        }) => ({
          label: `Start: ${start}`,
          value: id,
        }));
      },
    },
    bookingId: {
      type: "string",
      label: "Booking ID",
      description: "The unique identifier of the booking",
      async options({
        eventDate, page,
      }) {
        const { data } = await this.listBookingsForDate({
          eventDate,
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id, attributes: { ref },
        }) => ({
          label: `Ref: ${ref}`,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ticketsource.io";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
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
    listEvents(opts = {}) {
      return this._makeRequest({
        path: "/events",
        ...opts,
      });
    },
    getEvent({
      eventId, ...opts
    }) {
      return this._makeRequest({
        path: `/events/${eventId}`,
        ...opts,
      });
    },
    listEventDates({
      eventId, ...opts
    }) {
      return this._makeRequest({
        path: `/events/${eventId}/dates`,
        ...opts,
      });
    },
    listBookingsForDate({
      eventDate, ...opts
    }) {
      return this._makeRequest({
        path: `/dates/${eventDate}/bookings`,
        ...opts,
      });
    },
    getBooking({
      bookingId, ...opts
    }) {
      return this._makeRequest({
        path: `/bookings/${bookingId}`,
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
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
        params.per_page = LIMIT;
        const { data } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
