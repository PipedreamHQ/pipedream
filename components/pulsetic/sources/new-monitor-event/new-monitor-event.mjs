import { axios } from "@pipedream/platform";
import pulsetic from "../../pulsetic.app.mjs";

export default {
  key: "pulsetic-new-monitor-event",
  name: "New Monitor Event",
  description: "Emits a new event when a monitor event occurs. [See the documentation](https://app.pulsetic.com/account/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    pulsetic,
    db: "$.service.db",
    monitorId: pulsetic.propDefinitions.monitorId,
    startDt: pulsetic.propDefinitions.startDt,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Emit events for the first time during deployment
      const startDt = this.db.get("lastStartDt") || this.startDt;
      const events = await this.pulsetic.emitEvent({
        monitorId: this.monitorId,
        startDt,
      });
      events.forEach((event) => {
        this.$emit(event, {
          id: event.id,
          summary: `New Event: ${event.title}`,
          ts: Date.parse(event.created_at),
        });
      });
      // Update the start date for the next poll
      this.db.set("lastStartDt", new Date().toISOString()
        .split("T")[0]);
    },
  },
  async run() {
    const startDt = this.db.get("lastStartDt") || this.startDt;
    const events = await this.pulsetic.emitEvent({
      monitorId: this.monitorId,
      startDt,
    });
    events.forEach((event) => {
      this.$emit(event, {
        id: event.id,
        summary: `New Event: ${event.title}`,
        ts: Date.parse(event.created_at),
      });
    });
    // Update the start date for the next poll
    this.db.set("lastStartDt", new Date().toISOString()
      .split("T")[0]);
  },
};
