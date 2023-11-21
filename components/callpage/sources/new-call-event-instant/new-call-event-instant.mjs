import callpage from "../../callpage.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "callpage-new-call-event-instant",
  name: "New Call Event (Instant)",
  description: "Emits an event when there is a new call event. [See the documentation]()", // Placeholder for documentation link
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    callpage,
    db: "$.service.db",
    callStatus: {
      propDefinition: [
        callpage,
        "callStatus",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical call events
      const now = Math.floor(Date.now() / 1000);
      const oneDayAgo = now - 24 * 60 * 60;
      const historicalEvents = await this.callpage._makeRequest({
        path: `/api/v3/external/calls/history?date_from=${oneDayAgo}&date_to=${now}&statuses[]=${this.callStatus.join("&statuses[]=")}`,
      });

      const eventsToEmit = historicalEvents.slice(-50).reverse();
      for (const event of eventsToEmit) {
        this.$emit(event, {
          id: event.id,
          summary: `New Call Event: ${event.human_status}`,
          ts: Date.parse(event.created_at),
        });
      }
    },
  },
  async run() {
    // Fetch new call events
    const lastEventTimestamp = this.db.get("lastEventTimestamp") || Math.floor(Date.now() / 1000);
    const newEvents = await this.callpage._makeRequest({
      path: `/api/v3/external/calls/history?date_from=${lastEventTimestamp}&statuses[]=${this.callStatus.join("&statuses[]=")}`,
    });

    // Emit new events and update the last event timestamp
    for (const event of newEvents) {
      this.$emit(event, {
        id: event.id,
        summary: `New Call Event: ${event.human_status}`,
        ts: Date.parse(event.created_at),
      });
    }

    if (newEvents.length > 0) {
      const latestTimestamp = newEvents[newEvents.length - 1].created_at;
      this.db.set("lastEventTimestamp", Math.floor(Date.parse(latestTimestamp) / 1000));
    }
  },
};
