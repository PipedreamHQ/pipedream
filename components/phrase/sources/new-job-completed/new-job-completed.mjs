import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Job Completed (Instant)",
  version: "0.0.1",
  key: "phrase-new-job-completed",
  description: "Emit new event on each job is completed.",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      const jobs = await this.phrase.getJobs({
        projectId: this.projectId,
        params: {
          per_page: 10,
          state: "completed",
        },
      });

      jobs.forEach(this.emitEvent);
    },
  },
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "jobs:complete";
    },
    emitEvent(data) {
      const job = data.job ?? data;

      this.$emit(data, {
        id: job.id,
        summary: `New job completed with id ${job.id}`,
        ts: Date.parse(job.updated_at),
      });
    },
  },
};
