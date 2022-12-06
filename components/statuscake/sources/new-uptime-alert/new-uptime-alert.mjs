import statuscake from "../../statuscake.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Uptime Alert",
  version: "0.0.3",
  key: "statuscake-new-uptime-alert",
  description: "Emit new event on each new uptime alert.",
  type: "source",
  dedupe: "unique",
  props: {
    statuscake,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    uptimeId: {
      propDefinition: [
        statuscake,
        "uptimeId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New alert with id ${data.id}`,
        ts: new Date(),
      });

      this._setLastAlertId(data.id);
    },
    _setLastAlertId(alertId) {
      this.db.set("lastAlertId", alertId);
    },
    _getLastAlertId() {
      this.db.get("lastAlertId");
    },
  },
  hooks: {
    async deploy() {
      const alerts = await this.statuscake.getAlerts({
        uptimeId: this.uptimeId,
        params: {
          limit: 10,
        },
      });

      alerts.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastAlertId = this._getLastAlertId();

    let page = 1;

    while (true) {
      const alerts = await this.statuscake.getAlerts({
        uptimeId: this.uptimeId,
        params: {
          page,
          limit: 100,
        },
      });

      alerts.reverse().forEach(this.emitEvent);

      const alertIds = alerts.map((uptime) => uptime.id);

      if (alerts.length < 100 || alertIds.includes(lastAlertId)) {
        return;
      }

      page++;
    }
  },
};
