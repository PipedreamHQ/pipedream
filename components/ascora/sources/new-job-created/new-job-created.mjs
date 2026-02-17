import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ascora-new-job-created",
  name: "New Job Created (Instant)",
  description: "Emit new event when a new job is created. [See the documentation](https://www.ascora.com.au/Assets/Guides/AscoraApiGuide.pdf)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "JobCreated";
    },
    generateMeta(job) {
      return {
        id: job.jobId,
        summary: `New job created with ID: ${job.jobId}`,
        ts: Date.parse(job.dateCreated),
      };
    },
  },
  sampleEmit,
};
