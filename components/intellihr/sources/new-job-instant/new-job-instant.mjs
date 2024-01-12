import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "intellihr-new-job-instant",
  name: "New Job (Instant)",
  description: "Emit new event when a new job is created in intellihr. [See the documentation](https://developers.intellihr.io/docs/v1/#tag/Webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "job.created";
    },
    getSummary(job) {
      return `New Job Created ${job.id}`;
    },
  },
  sampleEmit,
};
