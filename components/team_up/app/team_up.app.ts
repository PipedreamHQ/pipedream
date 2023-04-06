import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateEventParams,
  DeleteEventParams, HttpRequestParams, ListEventsParams, ListSubCalendarsParams, UpdateEventParams,
} from "../common/requestParams";
import {
  CreateEventResponse,
  DeleteEventResponse,
  ListEventsResponse, SubCalendar, UpdateEventResponse,
} from "../common/responseSchemas";

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
      description: "By default, only events from the current day are listed. You can use the **List Events** action to obtain other events and use their *Event ID* here.",
      async options({ calendarKey }: Record<string, string>) {
        const response: ListEventsResponse = await this.listEvents({
          calendarKey,
        });
        return response?.events.map(({
          id, title,
        }) => ({
          label: title ?? id,
          value: id,
        }));
      },
    },
    subCalendarIds: {
      type: "string[]",
      label: "Sub-calendar IDs",
      description: "A list of ids of sub-calendars to which the event is assigned.",
      async options({ calendarKey }: Record<string, string>) {
        const items: SubCalendar[] = await this.listSubCalendars({
          calendarKey,
        });
        return items?.map(({
          id, name,
        }) => ({
          label: name ?? id,
          value: id,
        }));
      },
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date/time of the event in ISO format, e.g. `2023-04-15T14:00:00Z`",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date/time of the event in ISO format, e.g. `2023-04-15T14:00:00Z`",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.teamup.com";
    },
    _getHeaders(): Record<string, string> {
      return {
        "Content-Type": "application/json",
        "Teamup-Token": this.$auth.api_key,
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
    }: CreateEventParams): Promise<CreateEventResponse> {
      return this._httpRequest({
        method: "POST",
        url: `/${calendarKey}/events`,
        ...args,
      });
    },
    async deleteEvent({
      calendarKey, eventId, ...args
    }: DeleteEventParams): Promise<DeleteEventResponse> {
      return this._httpRequest({
        method: "DELETE",
        url: `/${calendarKey}/events/${eventId}`,
        ...args,
      });
    },
    async listEvents({
      calendarKey, ...args
    }: ListEventsParams): Promise<ListEventsResponse> {
      const response = await this._httpRequest({
        url: `/${calendarKey}/events`,
        ...args,
      });
      return response;
    },
    async updateEvent({
      calendarKey, eventId, ...args
    }: UpdateEventParams): Promise<UpdateEventResponse> {
      return this._httpRequest({
        method: "PUT",
        url: `/${calendarKey}/events/${eventId}`,
        ...args,
      });
    },
    async listSubCalendars({
      calendarKey, ...args
    }: ListSubCalendarsParams): Promise<SubCalendar[]> {
      const response = await this._httpRequest({
        url: `/${calendarKey}/subcalendars`,
        ...args,
      });
      return response.subcalendars;
    },
  },
});
