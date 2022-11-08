import common from "./common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    ...common.methods,
    getLastEvent() {
      return this.db.get("lastEvent");
    },
    setLastEvent(date) {
      this.db.set("lastEvent", date);
    },
  },
};
