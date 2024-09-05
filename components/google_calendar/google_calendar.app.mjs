import timezones from "moment-timezone";
import calendar from "@googleapis/calendar";
import constants from "./common/constants.mjs";
import { closest } from "color-2-name";

export default {
  type: "app",
  app: "google_calendar",
  propDefinitions: {
    calendarId: {
      label: "Calendar ID",
      type: "string",
      description: "Optionally select the calendar, defaults to the primary calendar for the logged-in user",
      default: "primary",
      optional: true,
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        if (nextPageToken === false) {
          return [];
        }
        const response = await this.listCalendars({
          pageToken: nextPageToken,
        });
        const options = response.items.map((item) => ({
          label: item.summary,
          value: item.id,
        }));
        return {
          options,
          context: {
            nextPageToken: response.nextPageToken ?? false,
          },
        };
      },
    },
    eventId: {
      label: "Event ID",
      type: "string",
      description: "Select an event from Google Calendar.",
      async options({ calendarId }) {
        const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
        const response = await this.listEvents({
          calendarId,
          maxResults: 100,
          timeMin: monthAgo,
        });
        const options = response.items.map((item) => {
          let label = item.summary || item.id;
          const date = item.start && (item.start.date
            ? item.start.date
            : item.start.dateTime.slice(0, 10));
          if (date) {
            label += ` - ${date}`;
          }
          return {
            label,
            value: item.id,
          };
        });
        return options.reverse();
      },
    },
    iCalUID: {
      label: "iCal UID",
      description: "Specifies event ID in the iCalendar format to be included in the response. Optional.",
      optional: true,
      type: "string",
    },
    maxAttendees: {
      label: "Max Attendees",
      description: "The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.",
      optional: true,
      type: "integer",
    },
    maxResults: {
      label: "Max Results",
      description: "Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.",
      optional: true,
      type: "integer",
    },
    orderBy: {
      label: "Order By",
      description: "The order of the events returned in the result. Optional. The default is an unspecified, stable order. Must set Single Events to `true` to order by `startTime`.",
      optional: true,
      type: "string",
      options: [
        {
          label: "startTime",
          value: "startTime",
        },
        {
          label: "updated",
          value: "updated",
        },
      ],
      default: "startTime",
    },
    privateExtendedProperty: {
      label: "Private extended property",
      description: "Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints.",
      optional: true,
      type: "string",
    },
    q: {
      label: "Query",
      description: "Free text search terms to find events that match these terms in any field, except for extended properties. Optional.",
      optional: true,
      type: "string",
    },
    sharedExtendedProperty: {
      label: "Shared Extended Property",
      description: "Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.",
      optional: true,
      type: "string",
    },
    showDeleted: {
      label: "Show Deleted",
      description: "Whether to include deleted events (with status equals \"cancelled\") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.",
      optional: true,
      type: "boolean",
    },
    showHiddenInvitations: {
      label: "Show Hidden Invitations",
      description: "Whether to include hidden invitations in the result. Optional. The default is False.",
      optional: true,
      type: "boolean",
    },
    singleEvents: {
      label: "Single Events",
      description: "Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.",
      optional: true,
      type: "boolean",
    },
    syncToken: {
      label: "Sync Token",
      description: "Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All events deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False.",
      optional: true,
      type: "string",
    },
    timeMax: {
      label: "Max Time",
      description: "Upper bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be greater than Min Time.",
      optional: true,
      type: "string",
    },
    timeMin: {
      label: "Min time",
      description: "Lower bound (exclusive) for an event's time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. Must be smaller than Max Time.",
      optional: true,
      type: "string",
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Time zone used in the response. Optional. The default is the time zone of the calendar.",
      optional: true,
      options() {
        const timeZonesList = timezones.tz.names().map((timezone) => {
          return {
            label: timezone,
            value: timezone,
          };
        });
        return timeZonesList;
      },
    },
    updatedMin: {
      label: "Minimum Updated Time",
      description: "Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time.",
      optional: true,
      type: "string",
    },
    ruleId: {
      label: "ACL Rule Identifier",
      type: "string",
      description: "ACL rule identifier.",
      async options({
        calendarId, prevContext,
      }) {
        const { nextPageToken } = prevContext;
        if (nextPageToken === false) {
          return [];
        }
        const response = await this.listAcls({
          calendarId,
          pageToken: nextPageToken,
        });
        const options = response.items.map((item) => ({
          label: item.role,
          value: item.id,
        }));
        return {
          options,
          context: {
            nextPageToken: response.nextPageToken ?? false,
          },
        };
      },
    },
    role: {
      label: "Role",
      type: "string",
      description: "The role assigned to the scope.",
      optional: true,
      options() {
        const roles = [
          "none",
          "freeBusyReader",
          "reader",
          "writer",
          "owner",
        ];
        return roles.map((role) => ({
          label: role,
          value: role,
        }));
      },
    },
    scopeType: {
      label: "Type of the Scope",
      type: "string",
      description: "The extent to which calendar access is granted by this ACL rule.",
      optional: true,
      options() {
        const types = [
          "user",
          "group",
          "domain",
        ];
        return types.map((type) => ({
          label: type,
          value: type,
        }));
      },
    },
    scopeValue: {
      label: "Value of the Scope",
      type: "string",
      description: "The email address of a user or group, or the name of a domain, depending on the scope type. Omitted for type 'default'",
      optional: true,
    },
    sendUpdates: {
      label: "Send Updates",
      type: "string",
      description: "Configure whether to send notifications about the event",
      optional: true,
      options: [
        "all",
        "externalOnly",
        "none",
      ],
    },
    colorId: {
      label: "Color ID",
      type: "string",
      description: "The color assigned to this event on your calendar. You can only select a color from the list of event colors provided from your calendar. This setting will only affect your calendar.",
      optional: true,
      async options() {
        const response = await this.listColors();
        return Object.entries(response.event).map(([
          key,
          value,
        ]) => ({
          label: `${closest(value.background).name} (${value.background})`,
          value: key,
        }));
      },
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Filter events by event type",
      optional: true,
      options: [
        "default",
        "focusTime",
        "outOfOffice",
        "workingLocation",
      ],
    },
  },
  methods: {
    _tokens() {
      return {
        access_token: this?.$auth?.oauth_access_token,
        refresh_token: this?.$auth?.oauth_refresh_token,
      };
    },
    client() {
      const auth = new calendar.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return calendar.calendar({
        version: "v3",
        auth,
      });
    },
    async requestHandler({
      api, method, args = {},
    }) {
      const {
        returnOnlyData = true,
        ...otherArgs
      } = args;
      try {
        const calendar = this.client();
        const response = await calendar[api][method](otherArgs);
        return returnOnlyData
          ? response.data
          : response;
      } catch (error) {
        console.error(JSON.stringify(error.response?.data, null, 2));
        throw error.response?.data?.error?.message ?? error;
      }
    },
    async createCalendar(args = {}) {
      return this.requestHandler({
        api: constants.API.CALENDARS.NAME,
        method: constants.API.CALENDARS.METHOD.INSERT,
        args,
      });
    },
    async deleteCalendar(args = {}) {
      return this.requestHandler({
        api: constants.API.CALENDARS.NAME,
        method: constants.API.CALENDARS.METHOD.DELETE,
        args,
      });
    },
    async getCalendar(args = {}) {
      return this.requestHandler({
        api: constants.API.CALENDARS.NAME,
        method: constants.API.CALENDARS.METHOD.GET,
        args,
      });
    },
    async listCalendars(args = {}) {
      return this.requestHandler({
        api: constants.API.CALENDAR_LIST.NAME,
        method: constants.API.CALENDAR_LIST.METHOD.LIST,
        args,
      });
    },
    async clearCalendar(args = {}) {
      return this.requestHandler({
        api: constants.API.CALENDARS.NAME,
        method: constants.API.CALENDARS.METHOD.CLEAR,
        args,
      });
    },
    async createAcl(args = {}) {
      return this.requestHandler({
        api: constants.API.ACL.NAME,
        method: constants.API.ACL.METHOD.INSERT,
        args,
      });
    },
    async updateAcl(args = {}) {
      return this.requestHandler({
        api: constants.API.ACL.NAME,
        method: constants.API.ACL.METHOD.UPDATE,
        args,
      });
    },
    async deleteAcl(args = {}) {
      return this.requestHandler({
        api: constants.API.ACL.NAME,
        method: constants.API.ACL.METHOD.DELETE,
        args,
      });
    },
    async getAcl(args = {}) {
      return this.requestHandler({
        api: constants.API.ACL.NAME,
        method: constants.API.ACL.METHOD.GET,
        args,
      });
    },
    async listAcls(args = {}) {
      return this.requestHandler({
        api: constants.API.ACL.NAME,
        method: constants.API.ACL.METHOD.LIST,
        args,
      });
    },
    async createEvent(args = {}) {
      return this.requestHandler({
        api: constants.API.EVENTS.NAME,
        method: constants.API.EVENTS.METHOD.INSERT,
        args,
      });
    },
    async updateEvent(args = {}) {
      return this.requestHandler({
        api: constants.API.EVENTS.NAME,
        method: constants.API.EVENTS.METHOD.UPDATE,
        args,
      });
    },
    async deleteEvent(args = {}) {
      return this.requestHandler({
        api: constants.API.EVENTS.NAME,
        method: constants.API.EVENTS.METHOD.DELETE,
        args,
      });
    },
    async getEvent(args = {}) {
      return this.requestHandler({
        api: constants.API.EVENTS.NAME,
        method: constants.API.EVENTS.METHOD.GET,
        args,
      });
    },
    async listEvents(args = {}) {
      return this.requestHandler({
        api: constants.API.EVENTS.NAME,
        method: constants.API.EVENTS.METHOD.LIST,
        args,
      });
    },
    async watchEvents(args = {}) {
      return this.requestHandler({
        api: constants.API.EVENTS.NAME,
        method: constants.API.EVENTS.METHOD.WATCH,
        args,
      });
    },
    async quickAddEvent(args = {}) {
      return this.requestHandler({
        api: constants.API.EVENTS.NAME,
        method: constants.API.EVENTS.METHOD.QUICK_ADD,
        args,
      });
    },
    async stopChannel(args = {}) {
      return this.requestHandler({
        api: constants.API.CHANNELS.NAME,
        method: constants.API.CHANNELS.METHOD.STOP,
        args,
      });
    },
    async queryFreeBusy(args = {}) {
      return this.requestHandler({
        api: constants.API.FREEBUSY.NAME,
        method: constants.API.FREEBUSY.METHOD.QUERY,
        args,
      });
    },
    async getSettings(args = {}) {
      return this.requestHandler({
        api: constants.API.SETTINGS.NAME,
        method: constants.API.SETTINGS.METHOD.GET,
        args,
      });
    },
    async fullSync(calendarId) {
      let nextSyncToken = null;
      let nextPageToken = null;
      while (!nextSyncToken) {
        const syncResp =
          await this.listEvents({
            calendarId,
            pageToken: nextPageToken,
          });
        nextPageToken = syncResp?.nextPageToken;
        nextSyncToken = syncResp?.nextSyncToken;
      }
      return nextSyncToken;
    },
    async listColors(args = {}) {
      return this.requestHandler({
        api: constants.API.COLORS.NAME,
        method: constants.API.COLORS.METHOD.GET,
        args,
      });
    },
  },
};
