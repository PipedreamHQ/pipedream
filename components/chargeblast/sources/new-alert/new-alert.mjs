import chargeblastApp from "../../chargeblast.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "chargeblast-new-alert",
  name: "New Alert in Chargeblast",
  description: "Emits an event for each new alert in Chargeblast. [See the documentation](https://docs.chargeblast.io/reference/getembedalerts)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    chargeblast: {
      type: "app",
      app: "chargeblast",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    apiKey: {
      propDefinition: [
        chargeblastApp,
        "apiKey",
      ],
    },
    alertType: {
      propDefinition: [
        chargeblastApp,
        "alertType",
      ],
    },
  },
  methods: {
    _getLastEmittedAlertId() {
      return this.db.get("lastEmittedAlertId") || null;
    },
    _setLastEmittedAlertId(id) {
      this.db.set("lastEmittedAlertId", id);
    },
  },
  hooks: {
    async deploy() {
      // Emit the last 50 alerts in order of most recent to least recent
      const { data: alerts } = await this.chargeblast.getAlerts({
        alertType: this.alertType,
      });
      const lastAlerts = alerts.slice(0, 50).reverse();
      for (const alert of lastAlerts) {
        this.$emit(alert, {
          id: alert.id,
          summary: `New Alert: ${alert.description}`,
          ts: Date.parse(alert.created_at),
        });
      }
      const lastEmittedId = lastAlerts.length > 0
        ? lastAlerts[0].id
        : null;
      this._setLastEmittedAlertId(lastEmittedId);
    },
  },
  async run() {
    const lastEmittedAlertId = this._getLastEmittedAlertId();
    const { data: alerts } = await this.chargeblast.getAlerts({
      alertType: this.alertType,
    });

    for (const alert of alerts) {
      if (alert.id === lastEmittedAlertId) {
        // We've reached the last emitted alert, stop processing
        break;
      }
      this.$emit(alert, {
        id: alert.id,
        summary: `New Alert: ${alert.description}`,
        ts: Date.parse(alert.created_at),
      });
    }

    // Set the last emitted id to the first one in the fetched array
    if (alerts.length > 0) {
      this._setLastEmittedAlertId(alerts[0].id);
    }
  },
};
