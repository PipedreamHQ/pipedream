import openai from "../../openai.app.mjs";

export default {
  key: "openai-new-fine-tuning-job",
  name: "New Fine Tuning Job",
  description: "Emits an event each time a new fine-tuning job is detected. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    openai,
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch the last 10 fine-tuning jobs during deploy
      const jobs = await this.openai.listFineTuningJobs();
      const lastJobs = jobs.slice(-10); // Ensure we're getting the most recent 10 jobs

      // Emit each job and save the most recent job ID
      let lastProcessedJobId;
      for (const job of lastJobs) {
        this.$emit(job, {
          id: job.id,
          summary: `New Fine Tuning Job: ${job.id}`,
          ts: job.created_at * 1000, // Convert to milliseconds
        });
        lastProcessedJobId = job.id;
      }

      // Save the last processed job ID for the next poll
      this.db.set("lastProcessedJobId", lastProcessedJobId);
    },
  },
  async run() {
    const lastProcessedJobId = this.db.get("lastProcessedJobId");
    let hasMore = true;
    let after = lastProcessedJobId;

    while (hasMore) {
      // Fetch fine-tuning jobs since the last processed job
      const jobs = await this.openai.listFineTuningJobs({
        after,
      });
      hasMore = jobs.has_more;

      // Emit each new job and update the last processed job ID
      for (const job of jobs.data) {
        this.$emit(job, {
          id: job.id,
          summary: `New Fine Tuning Job: ${job.id}`,
          ts: job.created_at * 1000, // Convert to milliseconds
        });
        after = job.id;
      }
    }

    // Save the last processed job ID for the next poll
    this.db.set("lastProcessedJobId", after);
  },
};
