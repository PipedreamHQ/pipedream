import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Job Started (Instant)",
  version: "0.0.1",
  key: "phrase-new-job-started",
  description: "Emit new event when each job is started.",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      const jobs = await this.phrase.getJobs({
        projectId: this.projectId,
        params: {
          per_page: 10,
          state: "in_progress",
        },
      });

      jobs.forEach(this.emitEvent);
    },
  },
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "jobs:start";
    },
    emitEvent(data) {
      const job = data.job ?? data;

      this.$emit(data, {
        id: job.id,
        summary: `New job started with id ${job.id}`,
        ts: Date.parse(job.updated_at),
      });
    },
  },
};
