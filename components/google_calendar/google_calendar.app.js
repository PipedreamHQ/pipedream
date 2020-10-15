const { google } = require("googleapis")
const get = require("lodash.get")

module.exports = {
  type: "app",
  app: "google_calendar",
  propDefinitions: {
    calendarId: {
      description: "Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the \"primary\" keyword.",
      type: "string"
    },
    iCalUID : {
      description: "Specifies event ID in the iCalendar format to be included in the response. Optional.",
      optional: true,
      type: "string"
    },
    maxAttendees: {
      description: "The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.",
      optional: true,
      type: "integer"
    },
    maxResults: {
      description: "Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.",
      optional: true,
      type: "integer"
    },
    orderBy: {
      description: "The order of the events returned in the result. Optional. The default is an unspecified, stable order.",
      optional: true,
      type: "string",
      options() {
        return [{label: "startTime", value: "startTime"}, {label: "updated", value: "updated"}]
      },
//      async options: ["startTime", "updated"],
      default: "startTime"
    },
    pageToken: {
      description: "Token specifying which result page to return. Optional.",
      optional: true,
      type: "string"
    },
    privateExtendedProperty: {
      description: "Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints.",
      optional: true,
      type: "string"
    },
    q: {
      description: "Free text search terms to find events that match these terms in any field, except for extended properties. Optional.",
      optional: true,
      type: "string"
    },
    sharedExtendedProperty: {
      description: "Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.",
      optional: true,
      type: "string"
    },
    showDeleted: {
      description: "Whether to include deleted events (with status equals \"cancelled\") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.",
      optional: true,
      type: "boolean"
    },
    showHiddenInvitations: {
      description: "Whether to include hidden invitations in the result. Optional. The default is False.",
      optional: true,
      type: "boolean"
    },
    singleEvents: {
      description: "Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.",
      optional: true,
      type: "boolean"
    },
    syncToken: {
      description: "Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All events deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False.",
      optional: true,
      type: "string"
    },
    timeMax: {
      description: "Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMin is set, timeMax must be greater than timeMin.",
      optional: true,
      type: "string"
    },
    timeMin: {
      description: "Lower bound (exclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax is set, timeMin must be smaller than timeMax.",
      optional: true,
      type: "string"
    },
    timeZone: {
      description: "Time zone used in the response. Optional. The default is the time zone of the calendar.",
      optional: true,
      type: "string"
    },
    updatedMin: { description: "Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time.",
      optional: true,
      type: "string"
    }
  },
  methods: {
    _tokens() {
      const access_token = get(this, "$auth.oauth_access_token")
      const refresh_token = get(this, "$auth.oauth_refresh_token")
      return {
        access_token,
        refresh_token,
      }
    },
    // returns a calendar object you can do whatever you want with
    calendar() {
      const auth = new google.auth.OAuth2()
      auth.setCredentials(this._tokens())
      const calendar = google.calendar({version: "v3", auth})
      return calendar
    },
    async calendarList() {
      const calendar = this.calendar()
      const resp = await calendar.calendarList.list()
      return resp
    },
    async list(config) {
      const calendar = this.calendar()
      const resp = await calendar.events.list(config)
      return resp
    },
    // for config key value pairs - https://developers.google.com/calendar/v3/reference/events/list
    // deprecated
    async getEvents(config) {
      return await this.list(config)
    },
    async watch(config) {
      const calendar = this.calendar()
      const resp = await calendar.events.watch(config)
      return resp
    },
    async stop(config) {
      const calendar = this.calendar()
      const resp = await calendar.channels.stop(config)
      return resp
    },
    async fullSync(calendarId) {
      let nextSyncToken = null
      let nextPageToken = null
      while(!nextSyncToken) {
        const listConfig = {
          calendarId,
          pageToken: nextPageToken
        }
        const syncResp = await this.list(listConfig)
        nextPageToken = get(syncResp, "data.nextPageToken")
        nextSyncToken = get(syncResp, "data.nextSyncToken")
      }
      return nextSyncToken
    }
  }
}

