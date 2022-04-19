import googleCalendar from "@googleapis/calendar";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "google_calendar",
  propDefinitions: {
    calendarId: {
      label: "Calendar ID",
      description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
      type: "string",
    },
    iCalUID: {
      label: "iCal UID",
      description: "Specifies event ID in the iCalendar format to be included in the response. Optional.",
      optional: true,
      type: "string",
    },
    maxAttendees: {
      label: "Max attendees",
      description: "The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.",
      optional: true,
      type: "integer",
    },
    maxResults: {
      label: "Max results",
      description: "Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.",
      optional: true,
      type: "integer",
    },
    orderBy: {
      label: "Order by",
      description: "The order of the events returned in the result. Optional. The default is an unspecified, stable order.",
      optional: true,
      type: "string",
      options() {
        return [
          {
            label: "startTime",
            value: "startTime",
          },
          {
            label: "updated",
            value: "updated",
          },
        ];
      },
      default: "startTime",
    },
    pageToken: {
      label: "Page token",
      description: "Token specifying which result page to return. Optional.",
      optional: true,
      type: "string",
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
      label: "Shared extended property",
      description: "Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.",
      optional: true,
      type: "string",
    },
    showDeleted: {
      label: "Show deleted",
      description: "Whether to include deleted events (with status equals \"cancelled\") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.",
      optional: true,
      type: "boolean",
    },
    showHiddenInvitations: {
      label: "Show hidden invitations",
      description: "Whether to include hidden invitations in the result. Optional. The default is False.",
      optional: true,
      type: "boolean",
    },
    singleEvents: {
      label: "Single events",
      description: "Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.",
      optional: true,
      type: "boolean",
    },
    syncToken: {
      label: "Sync token",
      description: "Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All events deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False.",
      optional: true,
      type: "string",
    },
    timeMax: {
      label: "Max start time",
      description: "Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMin is set, timeMax must be greater than timeMin.",
      optional: true,
      type: "string",
    },
    timeMin: {
      label: "Minimum end time",
      description: "Lower bound (exclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax is set, timeMin must be smaller than timeMax.",
      optional: true,
      type: "string",
    },
    timeZone: {
      label: "Time zone",
      description: "Time zone used in the response. Optional. The default is the time zone of the calendar.",
      optional: true,
      type: "string",
    },
    updatedMin: {
      label: "Minimum updated time",
      description: "Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time.",
      optional: true,
      type: "string",
    },
  },
  methods: {
    _tokens() {
      return {
        access_token: this.$auth.oauth_access_token,
        refresh_token: this.$auth.oauth_refresh_token,
      };
    },
    client() {
      const auth = new googleCalendar.auth.OAuth2();
      auth.setCredentials(this._tokens());
      return new googleCalendar({
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
        console.log("response", `${api} ${method}`, otherArgs, response);
        return returnOnlyData
          ? response.data
          : response;
      } catch (error) {
        console.error("Error!!!", error.response?.data || error);
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
    async queryFreebusy(args = {}) {
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
  },
};
