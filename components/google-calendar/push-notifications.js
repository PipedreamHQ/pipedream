const get = require("lodash.get");
const { v4: uuidv4 } = require("uuid")
const googleCalendar = require("https://github.com/PipedreamHQ/pipedream/components/google-calendar/google-calendar.app.js");

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

