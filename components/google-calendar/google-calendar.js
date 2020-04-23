const { google } = require("googleapis")
const _ = require("lodash")
const googleCalendar = {
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
      type: "string"
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
    updatedMin: {
      description: "Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time.",
      optional: true,
      type: "string"
    }
  },
  methods: {
    _tokens() {
      return {
        "access_token": this.$auth.oauth_access_token,
        "refresh_token": this.$auth.oauth_refresh_token,
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
      console.log(resp)
      return resp
    },
    // for config key value pairs - https://developers.google.com/calendar/v3/reference/events/list
    async getEvents(config) {
      const calendar = this.calendar()
      const resp = await calendar.events.list(config)
      return resp
    }
  }
}

let component = {
  name: 'calendar2',
  version: '0.0.1',
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [googleCalendar, "calendarId"]
    },
    calendarId2: {
      type: "string",
      async options() {
        const calListResp = await this.googleCalendar.calendarList()
        const calendars = _.get(calListResp, "data.items")
        const calendarIds = calendars.map(item => { return {value: item.id, label: item.summary} })
        return calendarIds
      }
    },
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "0/5 * * * *",
      },
    },
  },
  async run(event) {
    const now = new Date()

    const timeMin = new Date(now.getTime()).toISOString()
    const timeMax = new Date(now.getTime()+  (1000 * 1)).toISOString()

    const config = {
      calendarId: this.calendarId,
      timeMin,
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime',
    }
    const calListResp = await this.googleCalendar.calendarList()
    const calendars = _.get(calListResp, "data.items")
    const calendarIds = calendars.map(item => item.id)
    console.log(calendarIds)
      
    const resp = await this.googleCalendar.getEvents(config)

    const events = _.get(resp.data, "items")
    if (Array.isArray(events) && events.length) {
      const event = events[0]
      const eventStart = new Date(event.start.dateTime)
      if (eventStart.getTime() - now.getTime() < (1000 * 60 * 10)) {
        console.log("emitting data")
        this.$emit(event)
      } else {
        console.log("not emitting since event start time is > than 10 mins from now")
      }
    } else {
//      console.log(resp)
      console.log("nothing to emit")
    }
  },
};
module.exports = component
