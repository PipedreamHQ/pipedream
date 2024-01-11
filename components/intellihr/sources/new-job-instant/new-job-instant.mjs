import intellihr from "../../intellihr.app.mjs";

export default {
  key: "intellihr-new-job-instant",
  name: "New Job Instant",
  description: "Emit new event when a new job is created in intellihr. [See the documentation](https://developers.intellihr.io/docs/v1/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    intellihr,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const { data: jobs } = await this.intellihr.searchPerson();
      jobs.slice(0, 50).forEach((job) => {
        this.$emit(job, {
          id: job.id,
          summary: `New Job: ${job.event}`,
          ts: Date.parse(job.timestamp),
        });
      });
    },
  },
  async run() {
    const { data: jobs } = await this.intellihr.searchPerson();
    jobs.forEach((job) => {
      this.$emit(job, {
        id: job.id,
        summary: `New Job: ${job.event}`,
        ts: Date.parse(job.timestamp),
      });
    });
  },
};
