import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import onelogin from "../../onelogin.app.mjs";

export default {
  key: "onelogin-new-directory-sync-event",
  name: "New Directory Sync Event",
  description: "Emit new event when a directory sync event is triggered in OneLogin. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    onelogin,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    directoryName: {
      propDefinition: [
        onelogin,
        "directoryName",
      ],
      optional: true,
    },
    syncStatus: {
      propDefinition: [
        onelogin,
        "syncStatus",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const events = await this.runFetchEvents();
      const recentEvents = events.slice(-50).reverse();
      for (const event of recentEvents) {
        this.$emit(
          event,
          {
            id: event.id.toString(),
            summary: `Directory Sync Event #${event.id}`,
            ts: Date.parse(event.created_at),
          },
        );
      }
      const lastEvent = recentEvents[recentEvents.length - 1];
      if (lastEvent) {
        await this.db.set("last_cursor", lastEvent.id);
      }
    },
    async activate() {
      // No webhook setup required for polling source
    },
    async deactivate() {
      // No webhook teardown required for polling source
    },
  },
  methods: {
    async runFetchEvents() {
      const lastCursor = await this.db.get("last_cursor");
      const params = {
        event_type_id: 13,
        limit: 50,
        sort: "-id",
      };
      if (lastCursor) {
        params.after_cursor = lastCursor;
      }
      if (this.directoryName) {
        params.directory_id = this.directoryName;
      }
      if (this.syncStatus) {
        params.resolution = this.syncStatus;
      }
      const response = await this.onelogin._makeRequest({
        path: "/events",
        params,
      });
      return response;
    },
  },
  async run() {
    const events = await this.runFetchEvents();
    for (const event of events) {
      this.$emit(
        event,
        {
          id: event.id.toString(),
          summary: `Directory Sync Event #${event.id}`,
          ts: Date.parse(event.created_at),
        },
      );
    }
    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      await this.db.set("last_cursor", lastEvent.id);
    }
  },
};
