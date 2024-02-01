import common from "../common/base-polling.mjs";
import md5 from "md5";

export default {
  ...common,
  key: "white-swan-new-earnings-event",
  name: "New Earnings Event",
  description: "Emit new event when a new earnings event is created for your account, such as credits from client referrals or partner payouts.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.whiteSwan.listEarningsEvents;
    },
    getItemKey(event) {
      return md5(JSON.stringify(event));
    },
    generateMeta(event) {
      const id = this.getItemKey(event);
      return {
        id,
        summary: `New Earnings Event - ${event.event_name}`,
        ts: Date.now(),
      };
    },
  },
};
