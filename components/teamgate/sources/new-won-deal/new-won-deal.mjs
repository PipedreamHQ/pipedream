import moment from "moment";
import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Won Deal",
  key: "teamgate-new-won-deal",
  description: "Emit new event when a deal is won. [See docs here](https://developers.teamgate.com/#8f23eadd-e356-4b45-bdbe-b1122da6f762)",
  version: "0.0.1",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(name, id) {
      return `New won deal: ${name} (${id})`;
    },
    getFunc() {
      return this.teamgate.listDeals;
    },
    getParams() {
      const lastTime = this._getLastTime();
      return {
        "order[statusChanged]": "desc",
        "statusChanged[gt]": lastTime
          ? moment(lastTime).add(2, "h")
            .format("YYYY-MM-DD HH:mm:ss")
          : null,
        "status": "won",
      };
    },
    getFieldTime(item) {
      return item.status.changed;
    },
  },
};
