import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  type: "source",
  key: "intellihr-new-training-instant",
  name: "New Training (Instant)",
  description: "Emit new event when a new training record is created in intellihr. [See the documentation](https://developers.intellihr.io/docs/v1/#tag/Webhooks)",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "training.created";
    },
    getSummary(training) {
      return `New Training Record Created ${training.id}`;
    },
  },
  sampleEmit,
};
