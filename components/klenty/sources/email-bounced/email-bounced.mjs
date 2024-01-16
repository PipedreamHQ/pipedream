import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "klenty-email-bounced",
  name: "New Email Bounced",
  description: "Emit new event when an email to a prospect bounces.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "onMailBounce";
    },
    getSummary(body) {
      return `Email to ${body.email} bounced`;
    },
  },
  sampleEmit,
};
