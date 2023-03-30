import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateEventParams,
  DeleteEventParams, Event, GetEventParams, HttpRequestParams, ListEventsParams, UpdateEventParams,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "team_up",
  propDefinitions: {
    calendarKey: {
      type: "string",
      label: "Calendar Key",
      description: "The Calendar Key to use. [See the TeamUp API Docs for more information.](https://apidocs.teamup.com/docs/api/ZG9jOjI4Mzk0ODA4-teamup-com-api-overview#calendar-key)",
    },
    eventId: {
      type: "string",
      label: "Event",
      description: "Select an **Event** from the list, or provide a custom *Event ID*.",
      async options({ calendarKey }) {
        const events = await this.listEvents({
          calendarKey,
        });
        return events.map(({
          id, title,
        }) => ({
          label: title,
          value: id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.teamup.com";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Teamup-Token": this.team_up.$auth.api_key,
      };
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._getBaseUrl(),
        headers: this._getHeaders(),
        ...args,
      });
    },
    async createEvent({
      calendarKey, ...args
    }: CreateEventParams) {
      return this._httpRequest({
        method: "POST",
        url: `/${calendarKey}/events`,
        ...args,
      });
    },
    async deleteEvent({
      calendarKey, eventId, ...args
    }: DeleteEventParams) {
      return this._httpRequest({
        method: "DELETE",
        url: `/${calendarKey}/events/${eventId}`,
        ...args,
      });
    },
    async getEvent({
      calendarKey, eventId, ...args
    }: GetEventParams): Promise<Event> {
      return this._httpRequest({
        url: `/${calendarKey}/events/${eventId}`,
        ...args,
      });
    },
    async listEvents({
      calendarKey, ...args
    }: ListEventsParams): Promise<Event[]> {
      const response = await this._httpRequest({
        url: `/${calendarKey}/events`,
        ...args,
      });
      return response.events;
    },
    async updateEvent({
      calendarKey, eventId, ...args
    }: UpdateEventParams) {
      return this._httpRequest({
        method: "PUT",
        url: `/${calendarKey}/events/${eventId}`,
        ...args,
      });
    },
  },
});
