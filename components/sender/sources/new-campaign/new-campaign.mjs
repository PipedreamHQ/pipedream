import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sender-new-campaign",
  name: "New Campaign (Instant)",
  description: "Emit new event when a new campaign is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "campaigns/new";
    },
    getSummary(body) {
      return `New Campaign: ${body.title}`;
    },
  },
  sampleEmit,
};
