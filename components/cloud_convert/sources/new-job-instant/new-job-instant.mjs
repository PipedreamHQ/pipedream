import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "cloud_convert-new-job-instant",
  name: "New Job (Instant)",
  description: "Emit new event when a new job has been created. [See the documentation](https://cloudconvert.com/api/v2/webhooks#webhooks-events)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.JOB_CREATED,
      ];
    },
    generateMeta(resource) {
      const { job } = resource;
      const ts = Date.parse(job.created_at);
      return {
        id: job.id,
        summary: `New Job: ${job.id}`,
        ts,
      };
    },
  },
};
