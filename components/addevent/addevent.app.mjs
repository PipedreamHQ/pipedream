import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "addevent",
  propDefinitions: {
    calendarId: {
      type: "string",
      label: "Calendar ID",
      description: "The ID of the calendar that this event will be associated with.",
      async options({ page }) {
        const { calendars } = await this.listCalendars({
          params: {
            page: page + 1,
          },
        });
        return calendars?.map((calendar) => ({
          label: calendar.title,
          value: calendar.id,
        })) || [];
      },
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event.",
      async options({ page }) {
        const { events } = await this.listEvents({
          params: {
            page: page + 1,
          },
        });
        return events?.map((event) => ({
          label: event.title,
          value: event.id,
        })) || [];
      },
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The event's timezone. This ensures that the event appears at the correct time for users regardless of their timezone. Defaults to the calendar's timezone if not provided.",
      async options() {
        const timezones = await this.listTimezones();
        return timezones.map(({ name }) => name );
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.addevent.com/calevent/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    listCalendars(args = {}) {
      return this._makeRequest({
        path: "/calendars",
        ...args,
      });
    },
    listEvents(args = {}) {
      return this._makeRequest({
        path: "/events",
        ...args,
      });
    },
    listSubscribers(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        ...args,
      });
    },
    listRsvps(args = {}) {
      return this._makeRequest({
        path: "/rsvps",
        ...args,
      });
    },
    listTimezones(args = {}) {
      return this._makeRequest({
        path: "/timezones",
        ...args,
      });
    },
    createEvent(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/events",
        ...args,
      });
    },
    createRsvp({
      eventId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/events/${eventId}/rsvps`,
        ...args,
      });
    },
    async *paginate({
      resourceFn, params, resourceType,
    }) {
      params = {
        ...params,
        page: 1,
        page_size: constants.DEFAULT_LIMIT,
      };
      let total = 0;
      do {
        const response = await resourceFn({
          params,
        });
        const items = response[resourceType];
        for (const item of items) {
          yield item;
        }
        total = items.length;
        params.page++;
      } while (total === params.page_size);
    },
  },
};
