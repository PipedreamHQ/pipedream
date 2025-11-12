import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "cloud_convert-job-failed-instant",
  name: "Job Failed (Instant)",
  description: "Emit new event when a CloudConvert job has failed. [See the documentation](https://cloudconvert.com/api/v2/webhooks#webhooks-events)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.JOB_FAILED,
      ];
    },
    generateMeta(resource) {
      const { job } = resource;
      const ts = Date.parse(job.created_at);
      return {
        id: `${job.id}-${ts}`,
        summary: `Job Failed: ${job.id}`,
        ts,
      };
    },
  },
};
