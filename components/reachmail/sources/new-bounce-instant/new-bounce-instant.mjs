import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "reachmail-new-bounce-instant",
  name: "New Bounce Instant",
  description: "Emit new event when a recipient's email address bounces.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getAction() {
      return "Bounce";
    },
    getSummary(body) {
      return `New bounce: ${body.Email}`;
    },
  },
  sampleEmit,
};
