import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ispring_learn-new-enrollment-instant",
  name: "New Enrollment (Instant)",
  description: "Emit new event when learners are enrolled in courses.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptionType() {
      return "LEARNERS_ENROLLED_IN_COURSE";
    },
    getSummary({ payloads }) {
      return `${payloads.length} new enrollment${payloads.length > 1
        ? "s"
        : ""} successfully created.`;
    },
  },
  sampleEmit,
};
