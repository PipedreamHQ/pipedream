import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "foursquare-new-tip",
  name: "New Tip",
  description: "Emit new event when a user adds a new tip.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New tip with Id: ${item.id}`;
    },
    getDataField() {
      return "tips";
    },
    getFn() {
      return this.foursquare.getUserTips;
    },
  },
  sampleEmit,
};
