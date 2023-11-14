import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import pingdom from "../../pingdom.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "pingdom-new-alert",
  name: "New Alert",
  description: "Emit new event when a new alert occurs. [See the documentation](https://docs.pingdom.com/api/)",
  version: "0.0.1",
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
  },
  methods: {
    _getLastDate() {
      return this.db.get("LastDate") || 0;
    },
    _setLastDate(LastDate) {
      this.db.set("LastDate", LastDate);
    },
    async startEvent(maxResults = false) {

      const lastDate = this._getLastDate();
      const { actions: { alerts } } = await this.pingdom.listActions({
        params: {
          from: lastDate,
        },
      });

      let mostRecentAlerts = [];

      if (alerts.length) {
        mostRecentAlerts = maxResults
          ? alerts.slice(alerts.length - 25, alerts.length)
          : alerts;
        this._setLastDate(mostRecentAlerts[0].time);
      }

      for (const alert of mostRecentAlerts) {
        this.$emit(alert, {
          id: alert.checkid + alert.time,
          summary: `New alert of check with Id: ${alert.checkid}`,
          ts: Date.parse(alert.time),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
