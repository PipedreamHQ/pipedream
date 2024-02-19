import rkvst from "../../rkvst.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "rkvst-new-event-detected",
  name: "New Event Detected",
  description: "Emits an event for each new activity related to any asset within the platform.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rkvst,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    activityType: {
      propDefinition: [
        rkvst,
        "activityType",
      ],
    },
  },
  methods: {
    _getLastEventTimestamp() {
      return this.db.get("lastEventTimestamp") ?? 0;
    },
    _setLastEventTimestamp(timestamp) {
      this.db.set("lastEventTimestamp", timestamp);
    },
    async _fetchNewEvents(since) {
      return this.rkvst._makeRequest({
        path: "/events",
        params: {
          since: new Date(since).toISOString(),
          sort: "timestamp:desc",
        },
      });
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 events since the component has no previous state
      const events = await this.rkvst._makeRequest({
        path: "/events",
        params: {
          limit: 50,
          sort: "timestamp:desc",
        },
      });

      // Emit each event and update the last event timestamp
      events.forEach((event) => {
        this.$emit(event, {
          id: event.identity,
          summary: `New Event: ${event.operation}`,
          ts: Date.parse(event.timestamp_declared),
        });
      });

      if (events.length > 0) {
        const lastEventTimestamp = Date.parse(events[0].timestamp_declared);
        this._setLastEventTimestamp(lastEventTimestamp);
      }
    },
  },
  async run() {
    const lastEventTimestamp = this._getLastEventTimestamp();
    const events = await this._fetchNewEvents(lastEventTimestamp);

    // Emit new events and update the last event timestamp
    events.forEach((event) => {
      this.$emit(event, {
        id: event.identity,
        summary: `New Event: ${event.operation}`,
        ts: Date.parse(event.timestamp_declared),
      });
    });

    if (events.length > 0) {
      const newLastEventTimestamp = Date.parse(events[0].timestamp_declared);
      this._setLastEventTimestamp(newLastEventTimestamp);
    }
  },
};
