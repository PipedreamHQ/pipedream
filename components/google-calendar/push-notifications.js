const get = require("lodash.get");
const { v4: uuidv4 } = require("uuid")
//const googleCalendar = require("https://github.com/PipedreamHQ/pipedream/components/google-calendar/google-calendar.app.js");
const { google } = require("googleapis")

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


module.exports = {
  name: "google-calendar-push-notifications",
  version: "0.0.1",
  props: {
    googleCalendar,
    db: "$.service.db",
    calendarId: {
      type: "string",
      async options() {
        const calListResp = await this.googleCalendar.calendarList();
        const calendars = get(calListResp, "data.items");
        if (calendars) {
          const calendarIds = calendars.map((item) => {
            return { value: item.id, label: item.summary };
          });
          return calendarIds;
        }
        return [];
      },
    },
    newOnly: {
      type: "boolean",
      label: "New Only",
      description: "Will only emit new events",
      default: false,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 1 * 60,
      }
    },
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const config = {
        calendarId: this.calendarId,
        requestBody: {
          id: uuidv4(),
          type: "web_hook",
          address: this.http.endpoint,
          params: {
            ttl: "90", // 60 interval?
          },
        },
      }
      const watchResp = await this.googleCalendar.watch(config)
      const data = watchResp.data
      // initial full sync get next sync token
      const nextSyncToken = await this.googleCalendar.fullSync(this.calendarId)

      this.db.set("nextSyncToken", nextSyncToken)
      this.db.set("channelId", data.id)
      this.db.set("resourceId", data.resourceId)
      this.db.set("expiration", data.expiration)
    },
    async deactivate() {
      const id = this.db.get("channelId")
      const resourceId = this.db.get("resourceId")
      if (id && resourceId) {
        const config = {
          requestBody: {
            id,
            resourceId
          }
        }
        const stopResp = await this.googleCalendar.stop(config)
        if (stopResp.status === 204) {
          console.log("webhook deactivated")
        } else {
          console.log("there was a problem deactivating the webhook")
        }
      }
    },
  },
  async run(event) {
    // refresh watch
    if (event.interval_seconds) {
      // get time
      const now = new Date()
      const intervalMs = event.interval_seconds * 1000
      // get expriration
      const expiration = this.db.get("expiration")
      const expireDate = new Date(parseInt(expiration))

      // if now + interval > expiration, refresh watch
      if (now.getTime() + intervalMs > expireDate.getTime()) {
        // do the webhook refresh
        const config = {
          calendarId: this.calendarId,
          requestBody: {
            id: uuidv4(),
            type: "web_hook",
            address: this.http.endpoint,
            params: {
              ttl: "90", // 60 interval?
            },
          },
        }
        const watchResp = await this.googleCalendar.watch(config)
        const data = watchResp.data
        // full sync get next sync token
        const nextSyncToken = await this.googleCalendar.fullSync(this.calendarId)

        // stop the previous watch
        const id = this.db.get("channelId")
        const resourceId = this.db.get("resourceId")
        if (id && resourceId) {
          const config = {
            requestBody: {
              id,
              resourceId
            }
          }
          const stopResp = await this.googleCalendar.stop(config)
          if (stopResp.status === 204) {
            console.log("webhook deactivated")
          } else {
            console.log("there was a problem deactivating the webhook")
          }
        }

        this.db.set("nextSyncToken", nextSyncToken)
        this.db.set("channelId", data.id)
        this.db.set("resourceId", data.resourceId)
        this.db.set("expiration", data.expiration)
      }

    } else {
      // verify channel id
      const expectedChannelId = this.db.get("channelId")
      const channelId = get(event, "headers.x-goog-channel-id")
      if (expectedChannelId != channelId) {
        console.log(`expected ${expectedChannelId} but got ${channelId}`)
        return
      }
      // check that resource state is exists
      if ("exists" != get(event, "headers.x-goog-resource-state")) {
        console.log("resource state mismatch")
        return
      }
      // do a listing and then emit everything?
      const syncToken = this.db.get("nextSyncToken")
      let nextSyncToken = null
      let nextPageToken = null
      while(!nextSyncToken) {
        const listConfig = {
          calendarId: this.calendarId,
          syncToken,
        }
        listConfig.pageToken = nextPageToken
        const syncResp = await this.googleCalendar.list(listConfig)
        if (syncResp.status == 410) {
          nextSyncToken = await this.googleCalendar.fullSync(this.calendarId)
          console.log("sync token is gone, resyncing")
          break
        }
        nextPageToken = get(syncResp, "data.nextPageToken")
        nextSyncToken = get(syncResp, "data.nextSyncToken")

        // loop and emit
        const events = get(syncResp, "data.items")
        if (Array.isArray(events)) {
          for (const event of events) {
            const { summary, id, updated, sequence} = event
            if (this.newOnly && sequence != 0) continue
            this.$emit(event, {
              summary,
              id,
              ts: +new Date(updated),
            })
          }
        }
      }

      this.db.set("nextSyncToken", nextSyncToken)
    }
  },
};

