import { axios } from "@pipedream/platform";
import guru from "../../guru.app.mjs";

export default {
  key: "guru-announcement-read-instant",
  name: "New Announcement Read",
  description: "Emit an event each time an announcement is read. [See the documentation](https://developer.getguru.com/reference/mark-an-announcement-alert-as-readput)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    guru,
    db: "$.service.db",
    alertId: {
      type: "string",
      label: "Alert ID",
      description: "The ID of the announcement alert to monitor for read events",
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
      await this.checkForAlertRead();
    },
    async activate() {
      // Setup logic for when the source is activated
    },
    async deactivate() {
      // Cleanup logic for when the source is deactivated
    },
  },
  methods: {
    async checkForAlertRead() {
      try {
        const readEvents = await this.guru.emitAlertReadEvent(this.alertId);

        const seenReadEvents = this.db.get("seenReadEvents") || [];

        for (const readEvent of readEvents) {
          if (!seenReadEvents.includes(readEvent.alertId)) {
            this.$emit(readEvent, {
              id: null,
              summary: `Announcement Read: ${readEvent.alertId}`,
              ts: new Date().getTime(),
            });
            seenReadEvents.push(readEvent.alertId);
          }
        }

        this.db.set("seenReadEvents", seenReadEvents);
      } catch (error) {
        console.error(`Error fetching alert read events: ${error}`);
      }
    },
  },
  async run() {
    await this.checkForAlertRead();
  },
};
