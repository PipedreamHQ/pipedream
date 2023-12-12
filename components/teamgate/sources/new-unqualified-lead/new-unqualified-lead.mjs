import moment from "moment";
import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Unqualified Lead",
  key: "teamgate-new-unqualified-lead",
  description: "Emit new event when a lead is unqualified. [See docs here](https://developers.teamgate.com/#4a60be88-9991-41d2-8949-7a0f47319c80)",
  version: "0.0.1",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(name, id) {
      return `New lead unqualified: ${name} (${id})`;
    },
    getFunc() {
      return this.teamgate.listLeads;
    },
    getParams() {
      const lastTime = this._getLastTime();
      return {
        "order": "statusTime:desc",
        "statusTime[gt]": lastTime
          ? moment(lastTime).add(2, "h")
            .format("YYYY-MM-DD HH:mm:ss")
          : null,
        "status": "Unqualified",
      };
    },
    getFieldTime(item) {
      return item.status.time;
    },
  },
};
