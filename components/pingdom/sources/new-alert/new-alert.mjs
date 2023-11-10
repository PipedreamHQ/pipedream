import pingdom from "../../pingdom.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "pingdom-new-alert",
  name: "New Alert",
  description: "Emit new event when a new alert occurs. [See the documentation](https://www.pingdom.com/resources/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    pingdom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    checkName: {
      propDefinition: [
        pingdom,
        "checkName",
      ],
    },
    host: {
      propDefinition: [
        pingdom,
        "host",
      ],
    },
    type: {
      propDefinition: [
        pingdom,
        "type",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch the most recent alerts to initialize the state
      const from = Math.floor(Date.now() / 1000) - 60 * 60 * 24; // 24 hours ago
      const to = Math.floor(Date.now() / 1000); // now
      const limit = 50; // Adjusted to 50 to stay within the historical event limit

      const alerts = await this.pingdom.getAlerts({
        from,
        to,
        limit,
      });
      if (alerts.length > 0) {
        // Store the most recent alert's timestamp
        this.db.set("lastAlertTimestamp", alerts[0].time);
        // Emit up to the most recent 50 alerts
        for (const alert of alerts.slice(0, 50)) {
          this.$emit(alert, {
            id: alert.id,
            summary: `New Alert: ${alert.description}`,
            ts: alert.time * 1000, // convert to milliseconds
          });
        }
      }
    },
  },
  methods: {
    async getAlertsSinceLastTimestamp() {
      const lastAlertTimestamp = this.db.get("lastAlertTimestamp") || 0;
      const from = lastAlertTimestamp;
      const to = Math.floor(Date.now() / 1000); // now
      const limit = 100;

      const alerts = await this.pingdom.getAlerts({
        from,
        to,
        limit,
      });
      if (alerts.length > 0) {
        // Update the stored timestamp
        this.db.set("lastAlertTimestamp", alerts[0].time);
      }
      return alerts;
    },
  },
  async run() {
    const alerts = await this.getAlertsSinceLastTimestamp();

    for (const alert of alerts) {
      this.$emit(alert, {
        id: alert.id,
        summary: `New Alert: ${alert.description}`,
        ts: alert.time * 1000, // convert to milliseconds
      });
    }
  },
};
