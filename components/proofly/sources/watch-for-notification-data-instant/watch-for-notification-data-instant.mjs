import proofly from "../../proofly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "proofly-watch-for-notification-data-instant",
  name: "Watch for Notification Data (Instant)",
  description: "Emits an event instantly when notification data is received. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    proofly,
    db: "$.service.db",
    dataId: {
      propDefinition: [
        proofly,
        "dataId",
      ],
    },
    dataContent: {
      propDefinition: [
        proofly,
        "dataContent",
      ],
    },
    notificationType: {
      propDefinition: [
        proofly,
        "notificationType",
      ],
      optional: true,
    },
    time: {
      propDefinition: [
        proofly,
        "time",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Emit at most 50 historical events
      const notifications = await this.proofly.getNotificationById({
        notificationId: this.dataId,
      });
      notifications.slice(-50).forEach((notification) => {
        this.$emit(notification, {
          id: notification.id,
          summary: `Received notification data with ID: ${notification.id}`,
          ts: Date.parse(notification.time) || new Date().getTime(),
        });
      });
    },
    activate() {
      // Since it's an instant source, there's no need to create a webhook subscription on activate
    },
    deactivate() {
      // Since it's an instant source, there's no need to delete a webhook subscription on deactivate
    },
  },
  async run() {
    // Since this is an instant source, the run method will not poll for data
    // Instead, it should be configured to respond to real-time events (e.g., via a webhook)
  },
};
