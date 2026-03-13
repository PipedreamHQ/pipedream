import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ascora-job-status-updated",
  name: "Job Status Updated (Instant)",
  description: "Emit new event when the status of a job is updated. [See the documentation](https://www.ascora.com.au/Assets/Guides/AscoraApiGuide.pdf)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEventType() {
      return "JobStatusChanged";
    },
    generateMeta(job) {
      return {
        id: job.jobId,
        summary: `Job status updated for job ID: ${job.jobId}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
