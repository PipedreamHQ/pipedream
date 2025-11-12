import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "cloud_convert-job-finished-instant",
  name: "Job Finished (Instant)",
  description: "Emit new event when a CloudConvert job has been completed. [See the documentation](https://cloudconvert.com/api/v2/webhooks#webhooks-events)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.JOB_FINISHED,
      ];
    },
    generateMeta(resource) {
      const { job } = resource;
      const ts = Date.parse(job.created_at);
      return {
        id: `${job.id}-${ts}`,
        summary: `Job Finished: ${job.id}`,
        ts,
      };
    },
  },
};
