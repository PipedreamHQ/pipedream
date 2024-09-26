import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_calendar",
  propDefinitions: {
    calendarId: {
      type: "string",
      description: "The id of the calendar",
      label: "Calendar ID",
      async options() {
        const { calendars } = await this.listCalendars({
          $: this,
        });
        return calendars.map((calendar) => ({
          label: calendar.name,
          value: calendar.uid,
        }));
      },
    },
    eventId: {
      type: "string",
      description: "The id of the target event for update",
      label: "Event ID",
      optional: true,
      async options({ calendarId }) {
        const { events } = await this.listEvents({
          $: this,
          calendarId,
        });
        return events.map((event) => ({
          label: event.title,
          value: event.uid,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://calendar.${this.$auth.base_api_url}/api/v1`;
    },
    _getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        headers = {},
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        headers: this._getHeaders(headers),
        ...otherArgs,
      };
      return axios($, config);
    },
    clearEmptyProps(obj) {
      return Object.entries(obj)
        .reduce((reduction,
          [
            key,
            value,
          ]) => {
          if (value === undefined || value === null) {
            return reduction;
          }
          return {
            ...reduction,
            [key]: value,
          };
        }, {});
    },
    listEvents({
      $ = this,
      calendarId,
      params,
    }) {
      return this._makeRequest({
        $,
        path: `/calendars/${calendarId}/events`,
        params,
      });
    },
    getEvent({
      $ = this,
      calendarId,
      eventId,
      params,
    }) {
      return this._makeRequest({
        $,
        path: `/calendars/${calendarId}/events/${eventId}`,
        params,
      });
    },
    listCalendars({
      $ = this,
      params,
    }) {
      return this._makeRequest({
        $,
        path: "/calendars",
        params,
      });
    },
    createEventSmartAdd({
      $ = this,
      eventDesc,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/smartadd",
        data: `saddtext=${eventDesc}`,
      });
    },
    createEvent({
      $ = this,
      calendarId,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/calendars/${calendarId}/events`,
        data: `eventdata=${JSON.stringify(
          this.clearEmptyProps(data),
        )}`,
      });
    },
    updateEvent({
      $ = this,
      calendarId,
      eventId,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: `/calendars/${calendarId}/events/${eventId}`,
        data: `eventdata=${JSON.stringify(
          this.clearEmptyProps(data),
        )}`,
      });
    },
  },
};
