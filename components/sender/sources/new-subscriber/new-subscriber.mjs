import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sender-new-subscriber",
  name: "New Subscriber (Instant)",
  description: "Emit new event when a new subscriber is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "subscribers/new";
    },
    getSummary(body) {
      return `New Subscriber: ${body.email}`;
    },
  },
  sampleEmit,
};
