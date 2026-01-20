import { v4 as uuid } from "uuid";
import sampleEmit from "./test-event.mjs";
import googleCalendar from "../../google_calendar.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "google_calendar-new-or-updated-event-instant",
  type: "source",
  name: "New Created or Updated Event (Instant)",
  description: "Emit new event when a Google Calendar events is created or updated (does not emit cancelled events)",
  version: "0.1.17",
  dedupe: "unique",
  props: {
    googleCalendar,
    db: "$.service.db",
    calendarIds: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
      type: "string[]",
      default: [
        "primary",
      ],
      label: "Calendars",
      description: "Select one or more calendars to watch (defaults to the primary calendar)",
    },
    newOnly: {
      label: "Emit only for new events",
      type: "boolean",
      description: "Emit new events only, and not updates to existing events (defaults to `false`)",
      optional: true,
      default: false,
    },
    http: "$.interface.http",
    timer: {
      label: "Push notification renewal schedule",
      description: "The Google Calendar API requires occasional renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      static: {
        intervalSeconds: constants.WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS,
      },
    },
  },
  hooks: {
    async deploy() {
      const events = [];
      const params = {
        maxResults: 25,
        orderBy: "updated",
        timeMin: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), // 1 month ago
      };
      for (const calendarId of this.calendarIds) {
        params.calendarId = calendarId;
        const { items } = await this.googleCalendar.listEvents(params);
        events.push(...items);
      }
      events.sort((a, b) => (Date.parse(a.updated) > Date.parse(b.updated))
        ? 1
        : -1);
      for (const event of events.slice(-25)) {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    },
    async activate() {
      await this.makeWatchRequest();
    },
    async deactivate() {
      try {
        await this.stopWatchRequest();
      } catch (e) {
        console.log(`Error deactivating webhook. ${e}`);
      }
    },
  },
  methods: {
    setNextSyncToken(calendarId, nextSyncToken) {
      this.db.set(`${calendarId}.nextSyncToken`, nextSyncToken);
    },
    getNextSyncToken(calendarId) {
      return this.db.get(`${calendarId}.nextSyncToken`);
    },
    setChannelId(calendarId, channelId) {
      this.db.set(`${calendarId}.channelId`, channelId);
    },
    getChannelId(calendarId) {
      return this.db.get(`${calendarId}.channelId`);
    },
    setResourceId(calendarId, resourceId) {
      this.db.set(`${calendarId}.resourceId`, resourceId);
    },
    getResourceId(calendarId) {
      return this.db.get(`${calendarId}.resourceId`);
    },
    setExpiration(calendarId, expiration) {
      this.db.set(`${calendarId}.expiration`, expiration);
    },
    getExpiration(calendarId) {
      return this.db.get(`${calendarId}.expiration`);
    },
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
      const ts = Date.parse(tsString);
      return {
        id: `${id}-${ts}`,
        summary,
        ts,
      };
    },
    async makeWatchRequest() {
      // Make watch request for this HTTP endpoint
      for (const calendarId of this.calendarIds) {
        const watchResp =
          await this.googleCalendar.watchEvents({
            calendarId,
            requestBody: {
              id: uuid(),
              type: "web_hook",
              address: this.http.endpoint,
            },
          });

        // Initial full sync. Get next sync token
        const nextSyncToken = await this.googleCalendar.fullSync(calendarId);

        this.setNextSyncToken(calendarId, nextSyncToken);
        this.setChannelId(calendarId, watchResp.id);
        this.setResourceId(calendarId, watchResp.resourceId);
        this.setExpiration(calendarId, watchResp.expiration);
      }
    },
    async stopWatchRequest() {
      for (const calendarId of this.calendarIds) {
        const id = this.getChannelId(calendarId);
        const resourceId = this.getResourceId(calendarId);
        if (id && resourceId) {
          const { status } =
            await this.googleCalendar.stopChannel({
              returnOnlyData: false,
              requestBody: {
                id,
                resourceId,
              },
            });
          if (status === 204) {
            console.log("webhook deactivated");
            this.setNextSyncToken(calendarId, null);
            this.setChannelId(calendarId, null);
            this.setResourceId(calendarId, null);
            this.setExpiration(calendarId, null);
          } else {
            console.log("There was a problem deactivating the webhook");
          }
        }
      }
    },
    getSoonestExpirationDate() {
      let min;
      for (const calendarId of this.calendarIds) {
        const expiration = parseInt(this.db.get(`${calendarId}.expiration`));
        if (!min || expiration < min) {
          min = expiration;
        }
      }
      return new Date(min);
    },
    getCalendarIdForChannelId(incomingChannelId) {
      for (const calendarId of this.calendarIds) {
        if (this.db.get(`${calendarId}.channelId`) === incomingChannelId) {
          return calendarId;
        }
      }
      return null;
    },
  },
  async run(event) {
    let calendarId = null; // calendar ID matching incoming channel ID

    // refresh watch
    if (event.interval_seconds) {
      // get time
      const now = new Date();
      const intervalMs = event.interval_seconds * 1000;
      // get expiration
      const expireDate = this.getSoonestExpirationDate();

      // if now + interval > expiration, refresh watch
      if (now.getTime() + intervalMs > expireDate.getTime()) {
        await this.stopWatchRequest();
        await this.makeWatchRequest();
      }
    } else {
      // Verify channel ID
      const incomingChannelId = event?.headers?.["x-goog-channel-id"];
      calendarId = this.getCalendarIdForChannelId(incomingChannelId);
      if (!calendarId) {
        console.log(
          `Unexpected channel ID ${incomingChannelId}. This likely means there are multiple, older subscriptions active.`,
        );
        return;
      }

      // Check that resource state === exists
      const state = event?.headers?.["x-goog-resource-state"];
      switch (state) {
      case "exists":
        // there's something to emit, so keep going
        break;
      case "not_exists":
        console.log("Resource does not exist. Exiting.");
        return;
      case "sync":
        console.log("New channel created");
        return;
      default:
        console.log(`Unknown state: ${state}`);
        return;
      }
    }

    // Fetch and emit events
    const checkCalendarIds = calendarId
      ? [
        calendarId,
      ]
      : this.calendarIds;
    for (const calendarId of checkCalendarIds) {
      const syncToken = this.getNextSyncToken(calendarId);
      let nextSyncToken = null;
      let nextPageToken = null;
      while (!nextSyncToken) {
        try {
          const { data: syncData = {} } = await this.googleCalendar.listEvents({
            returnOnlyData: false,
            calendarId,
            syncToken,
            pageToken: nextPageToken,
            maxResults: 2500,
          });

          nextPageToken = syncData.nextPageToken;
          nextSyncToken = syncData.nextSyncToken;

          const { items: events = [] } = syncData;
          events
            .filter(this.isEventRelevant, this)
            .forEach((event) => {
              const { status } = event;
              if (status === "cancelled") {
                console.log("Event cancelled. Exiting.");
                return;
              }
              const meta = this.generateMeta(event);
              this.$emit(event, meta);
            });
        } catch (error) {
          if (error === "Sync token is no longer valid, a full sync is required.") {
            console.log("Sync token invalid, resyncing");
            nextSyncToken = await this.googleCalendar.fullSync(calendarId);
            break;
          } else {
            throw error;
          }
        }
      }

      this.setNextSyncToken(calendarId, nextSyncToken);
    }
  },
  sampleEmit,
};
