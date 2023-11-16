import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pingdom-new-alert",
  name: "New Alert",
  description: "Emit new event when a new alert occurs. [See the documentation](https://docs.pingdom.com/api/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getLastInfo() {
      return this.db.get("LastDate") || 0;
    },
    setLastInfo(alert) {
      this.db.set("LastDate", alert.time);
    },
    getObjToEmit(alert) {
      console.log("alert: ", alert);

      return {
        id: alert.checkid + alert.time,
        summary: `New alert of check with Id: ${alert.checkid}`,
        ts: alert.time,
      };
    },
    async getItems(lastDate) {
      const { actions: { alerts } } = await this.pingdom.listActions({
        params: {
          from: lastDate,
        },
      });

      return alerts;
    },
  },
  sampleEmit,
};
