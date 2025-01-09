import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import motive from "../../motive.app.mjs";

export default {
  key: "motive-new-safety-event",
  name: "New Safety Event",
  description: "Emit new safety-related events like harsh braking or acceleration. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    motive: {
      type: "app",
      app: "motive",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    safetyCategory: {
      propDefinition: [
        motive,
        "safetyCategory",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const allEvents = await this.motive.paginate(this.motive.listDriverPerformanceEvents, {
        safetyCategory: this.safetyCategory,
      });

      // Sort events by timestamp ascending
      allEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Get the last 50 events
      const recentEvents = allEvents.slice(-50);

      for (const event of recentEvents) {
        this.$emit(
          event,
          {
            id: event.id || event.ts || Date.now(),
            summary: `New Safety Event: ${event.type}`,
            ts: event.timestamp
              ? Date.parse(event.timestamp)
              : Date.now(),
          },
        );
      }

      // Save the latest timestamp
      if (recentEvents.length > 0) {
        const latestEvent = recentEvents[recentEvents.length - 1];
        if (latestEvent.timestamp) {
          await this.db.set("latest_ts", Date.parse(latestEvent.timestamp));
        }
      }
    },
    async activate() {
      // No activation steps needed for polling source
    },
    async deactivate() {
      // No deactivation steps needed for polling source
    },
  },
  async run() {
    const latestTs = (await this.db.get("latest_ts")) || 0;

    const allEvents = await this.motive.paginate(this.motive.listDriverPerformanceEvents, {
      safetyCategory: this.safetyCategory,
    });

    // Filter events newer than the last seen timestamp
    const newEvents = allEvents.filter((event) => {
      return event.timestamp && Date.parse(event.timestamp) > latestTs;
    });

    // Sort new events by timestamp ascending
    newEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    for (const event of newEvents) {
      this.$emit(
        event,
        {
          id: event.id || event.ts || Date.now(),
          summary: `New Safety Event: ${event.type}`,
          ts: event.timestamp
            ? Date.parse(event.timestamp)
            : Date.now(),
        },
      );
    }

    // Update the latest timestamp in the database
    if (newEvents.length > 0) {
      const latestEvent = newEvents[newEvents.length - 1];
      if (latestEvent.timestamp) {
        await this.db.set("latest_ts", Date.parse(latestEvent.timestamp));
      }
    }
  },
};
