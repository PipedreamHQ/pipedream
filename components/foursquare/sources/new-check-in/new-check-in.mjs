import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "foursquare-new-check-in",
  name: "New Check-In",
  description: "Emit new event when a user checks in.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New Check-In with Id: ${item.id}`;
    },
    getDataField() {
      return "checkins";
    },
    getFn() {
      return this.foursquare.getUserCheckins;
    },
  },
  sampleEmit,
};
