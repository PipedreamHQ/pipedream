import cronfree from "../../cronfree.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cronfree-new-message-received",
  name: "New Message Received",
  description: "Emit new event when a new message is received. [See the documentation](https://docs.cronfree.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cronfree: {
      type: "app",
      app: "cronfree",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    wdays: {
      propDefinition: [
        cronfree,
        "wdays",
      ],
    },
    months: {
      propDefinition: [
        cronfree,
        "months",
      ],
    },
    mdays: {
      propDefinition: [
        cronfree,
        "mdays",
      ],
    },
    hours: {
      propDefinition: [
        cronfree,
        "hours",
      ],
    },
    minutes: {
      propDefinition: [
        cronfree,
        "minutes",
      ],
    },
    timezone: {
      propDefinition: [
        cronfree,
        "timezone",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { data } = await this.cronfree.scheduleEvent({
        hookUrl: this.http.endpoint,
        wdays: this.wdays,
        months: this.months,
        mdays: this.mdays,
        hours: this.hours,
        minutes: this.minutes,
        timezone: this.timezone,
      });
      // Save the scheduled event ID to delete it on deactivation
      this.db.set("scheduledEventId", data.id);
    },
    async activate() {
      // This hook is left intentionally empty
    },
    async deactivate() {
      // Delete the scheduled event
      const scheduledEventId = this.db.get("scheduledEventId");
      if (scheduledEventId) {
        await this.cronfree.deleteScheduledEvent({
          eventId: scheduledEventId,
        });
      }
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.id || `${Date.now()}`,
      summary: "New message received",
      ts: Date.now(),
    });
  },
};
