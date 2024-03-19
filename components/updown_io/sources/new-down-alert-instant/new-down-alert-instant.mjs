import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "updown_io-new-down-alert-instant",
  name: "New Down Alert (Instant)",
  description: "Emit new event when a website check reports as down. [See the documentation](https://updown.io/api#webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "check.down",
      ];
    },
  },
  sampleEmit,
};
