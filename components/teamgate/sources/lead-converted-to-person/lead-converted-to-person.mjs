import moment from "moment";
import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Lead Converted To Person",
  key: "teamgate-lead-converted-to-person",
  description: "Emit new event when a lead is converted to person.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(
      name, id,
    ) {
      return `Lead converted: ${name} (${id})`;
    },
    getParams() {
      const lastTime = this._getLastTime();
      return {
        "order": "converted:desc",
        "createdTime[gt]": lastTime,
      };
    },
    getFunc() {
      return this.teamgate.listPeople;
    },
    getFieldTime(item) {
      return item.created.time;
    },
    async processEvent(list) {
      list.reverse();
      list.forEach((item) => {
        const lastTime = this._getLastTime();
        const dateTime = this.getFieldTime(item);

        if (!lastTime || moment(dateTime).isAfter(lastTime)) this._setLastTime(dateTime);
        if (item.converted) this.$emit(item, this.getDataToEmit(item, dateTime));
      });
    },
  },
};
