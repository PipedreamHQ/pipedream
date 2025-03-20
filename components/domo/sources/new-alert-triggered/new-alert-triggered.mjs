import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import domo from "../../domo.app.mjs";

export default {
  key: "domo-new-alert-triggered",
  name: "New Alert Triggered",
  description: "Emit a new event when an alert is triggered in Domo based on predefined rules. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    domo: {
      type: "app",
      app: "domo",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    alertTypes: {
      propDefinition: [
        "domo",
        "alertTypes",
      ],
      optional: true,
    },
    relatedDatasets: {
      propDefinition: [
        "domo",
        "relatedDatasets",
      ],
      optional: true,
    },
  },
  methods: {
    emitAlert(alert) {
      const summary = `New Alert: ${alert.type} on Dataset ${alert.datasetId}`;
      const ts = alert.time
        ? new Date(alert.time).getTime()
        : Date.now();
      const id = alert.id || ts;
      this.$emit(alert, {
        id: id.toString(),
        summary,
        ts,
      });
    },
  },
  hooks: {
    async deploy() {
      const lastRun = await this.db.get("lastRun");
      const params = {
        offset: 0,
        limit: 50,
      };
      if (lastRun) {
        params.start = lastRun;
      }
      const alerts = await this.domo.listAlerts({
        params,
      });
      const sortedAlerts = alerts.sort((a, b) => new Date(b.time) - new Date(a.time));
      const latestAlerts = sortedAlerts.slice(0, 50);

      for (const alert of latestAlerts.reverse()) {
        this.emitAlert(alert);
      }

      if (latestAlerts.length > 0) {
        const latestTime = new Date(latestAlerts[0].time).getTime();
        await this.db.set("lastRun", latestTime);
      }
    },
    async activate() {
      // No webhook subscription needed
    },
    async deactivate() {
      // No webhook unsubscription needed
    },
  },
  async run() {
    const lastRun = await this.db.get("lastRun") || 0;
    const currentTime = Date.now();
    const params = {
      start: lastRun,
      end: currentTime,
      limit: 1000,
    };
    if (this.alertTypes && this.alertTypes.length > 0) {
      params.actionType = this.alertTypes.join(",");
    }
    if (this.relatedDatasets && this.relatedDatasets.length > 0) {
      params.objectId = this.relatedDatasets.join(",");
    }
    const alerts = await this.domo.listAlerts({
      params,
    });
    const newAlerts = alerts.filter((alert) => new Date(alert.time).getTime() > lastRun);

    for (const alert of newAlerts) {
      this.emitAlert(alert);
    }

    if (newAlerts.length > 0) {
      const latestTime = newAlerts.reduce((max, alert) => {
        const alertTime = new Date(alert.time).getTime();
        return alertTime > max
          ? alertTime
          : max;
      }, lastRun);
      await this.db.set("lastRun", latestTime);
    }
  },
};
