const get = require("lodash/get");
const { v4: uuid } = require("uuid");

const googleCalendar = require("../../google_calendar.app.js");

module.exports = {
  key: "google_calendar-new-or-updated-event-instant",
  name: "New or Updated Event (Instant)",
  description:
    "Emits when an event is created or updated (except when it's cancelled)",
  version: "0.0.4",
  props: {
    googleCalendar,
    db: "$.service.db",
    calendarId: {
      type: "string",
      label: "Calendar",
      async options() {
        const calListResp = await this.googleCalendar.calendarList();
        const calendars = get(calListResp, "data.items");
        if (calendars) {
          const calendarIds = calendars.map((item) => ({
            value: item.id,
            label: item.summary,
          }));
          return calendarIds;
        }
        return [];
      },
    },
    newOnly: {
      label: "New events only?",
      type: "boolean",
      description: "Emit new events only, and not updates to existing events",
    },
    http: "$.interface.http",
    timer: {
      label: "Push notification renewal schedule",
      description:
        "The Google Calendar API requires occasional renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 60 * 24,
      },
    },
  },
  hooks: {
    async activate() {
      // make watch request that will hit this http interface
      const config = {
        calendarId: this.calendarId,
        requestBody: {
          id: uuid(),
          type: "web_hook",
          address: this.http.endpoint,
        },
      };
      const watchResp = await this.googleCalendar.watch(config);
      const data = watchResp.data;

      // initial full sync get next sync token
      const nextSyncToken = await this.googleCalendar.fullSync(this.calendarId);

      this.db.set("nextSyncToken", nextSyncToken);
      this.db.set("channelId", data.id);
      this.db.set("resourceId", data.resourceId);
      this.db.set("expiration", data.expiration);
    },
    async deactivate() {
      const id = this.db.get("channelId");
      const resourceId = this.db.get("resourceId");
      if (id && resourceId) {
        const config = {
          requestBody: {
            id,
            resourceId,
          },
        };
        const stopResp = await this.googleCalendar.stop(config);
        if (stopResp.status === 204) {
          console.log("webhook deactivated");
          this.db.set("nextSyncToken", null);
          this.db.set("channelId", null);
          this.db.set("resourceId", null);
          this.db.set("expiration", null);
        } else {
          console.log("there was a problem deactivating the webhook");
        }
      }
    },
  },
  methods: {
    /**
     * A utility method to compute whether the provided event is newly created
     * or not. Since the Google Calendar API does not provide a specific way to
     * determine this, this method estimates the result based on the `created`
     * and `updated` timestamps: if they are more than 2 seconds apart, then we
     * assume that the event is not new.
     *
     * @param {Object} event - The calendar event being processed
     * @returns {Boolean} True if the input event is a newly created event, or
     * false otherwise
     */
    _isNewEvent(event) {
      const {
        created,
        updated,
      } = event;
      const createdTimestampMilliseconds = Date.parse(created);
      const updatedTimestampMilliseconds = Date.parse(updated);
      const diffMilliseconds = Math.abs(
        updatedTimestampMilliseconds - createdTimestampMilliseconds,
      );
      const maxDiffMilliseconds = 2000;
      return diffMilliseconds <= maxDiffMilliseconds;
    },
    /**
     * A utility method to compute whether the provided event is relevant to the
     * event source (and as a consequence must be processed) or not.
     *
     * @param {Object} event - The calendar event being processed
     * @returns {Boolean} True if the input event must be processed, or false
     * otherwise (i.e. if the event must be skipped)
     */
    isEventRelevant(event) {
      return !this.newOnly || this._isNewEvent(event);
    },
    generateMeta(event) {
      const {
        id,
        summary,
        updated: tsString,
      } = event;
      return {
        id,
        summary,
        ts: Date.parse(tsString),
      };
    },
  },
  async run(event) {
    // refresh watch
    if (event.interval_seconds) {
      // get time
      const now = new Date();
      const intervalMs = event.interval_seconds * 1000;
      // get expiration
      const expiration = this.db.get("expiration");
      const expireDate = new Date(parseInt(expiration));

      // if now + interval > expiration, refresh watch
      if (now.getTime() + intervalMs > expireDate.getTime()) {
        // do the webhook refresh
        const config = {
          calendarId: this.calendarId,
          requestBody: {
            id: uuid(),
            type: "web_hook",
            address: this.http.endpoint,
          },
        };
        const watchResp = await this.googleCalendar.watch(config);
        const data = watchResp.data;
        // full sync get next sync token
        const nextSyncToken = await this.googleCalendar.fullSync(
          this.calendarId,
        );

        // stop the previous watch
        const id = this.db.get("channelId");
        const resourceId = this.db.get("resourceId");
        if (id && resourceId) {
          const config = {
            requestBody: {
              id,
              resourceId,
            },
          };
          const stopResp = await this.googleCalendar.stop(config);
          if (stopResp.status === 204) {
            console.log("webhook deactivated");
          } else {
            console.log("there was a problem deactivating the webhook");
          }
        }

        this.db.set("nextSyncToken", nextSyncToken);
        this.db.set("channelId", data.id);
        this.db.set("resourceId", data.resourceId);
        this.db.set("expiration", data.expiration);
      }
    } else {
      // verify channel id
      const expectedChannelId = this.db.get("channelId");
      const channelId = get(event, "headers.x-goog-channel-id");
      if (expectedChannelId != channelId) {
        console.log(
          `expected ${expectedChannelId} but got ${channelId}.  Most likely there are multiple webhooks active.`,
        );
        return;
      }
      // check that resource state is exists
      const state = get(event, "headers.x-goog-resource-state");
      switch (state) {
      case "exists":
        // there's something to emit
        break;
      case "not_exists":
        // TODO handle this?
        return;
      case "sync":
        console.log("new channel created");
        return;
      }
      // do a listing and then emit everything?
      const syncToken = this.db.get("nextSyncToken");
      let nextSyncToken = null;
      let nextPageToken = null;
      while (!nextSyncToken) {
        const listConfig = {
          calendarId: this.calendarId,
          syncToken,
        };
        listConfig.pageToken = nextPageToken;
        const {
          data: syncData = {},
          status: syncStatus,
        } = await this.googleCalendar.list(listConfig);
        if (syncStatus == 410) {
          nextSyncToken = await this.googleCalendar.fullSync(this.calendarId);
          console.log("sync token is gone, resyncing");
          break;
        }
        nextPageToken = syncData.nextPageToken;
        nextSyncToken = syncData.nextSyncToken;

        // loop and emit
        const { items: events = [] } = syncData;
        events
          .filter(this.isEventRelevant, this)
          .forEach((event) => {
            const meta = this.generateMeta(event);
            this.$emit(event, meta);
          });
      }

      this.db.set("nextSyncToken", nextSyncToken);
    }
  },
};
