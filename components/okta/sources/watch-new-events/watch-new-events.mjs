import { axios } from "@pipedream/platform";
import okta from "../../okta.app.mjs";

export default {
  key: "okta-watch-new-events",
  name: "Watch New Events",
  description: "Emit new event when the system observes a new event. [See the documentation](https://developer.okta.com/docs/api/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    okta,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 300, // every 5 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 events to avoid duplicates on initial run
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 1 day ago
      const events = await this.okta._makeRequest({
        path: `/logs?since=${since}&limit=50`,
      });
      events.forEach((event) => {
        this.$emit(event, {
          id: event.uuid,
          summary: `New event: ${event.eventType}`,
          ts: Date.parse(event.published),
        });
      });
      // Update the last event time to the most recent event's published time
      if (events.length > 0) {
        const latestEventTime = events[0].published;
        this.db.set("lastEventTime", latestEventTime);
      }
    },
  },
  async run() {
    const lastEventTime = this.db.get("lastEventTime") || new Date().toISOString();
    const events = await this.okta._makeRequest({
      path: `/logs?since=${lastEventTime}&limit=100`,
    });

    events.forEach((event) => {
      this.$emit(event, {
        id: event.uuid,
        summary: `New event: ${event.eventType}`,
        ts: Date.parse(event.published),
      });
    });

    // Update the last event time to the most recent event's published time
    if (events.length > 0) {
      const mostRecentEvent = events[0].published;
      this.db.set("lastEventTime", mostRecentEvent);
    }
  },
};
