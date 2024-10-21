import common from "../common/base.mjs";

export default {
  ...common,
  key: "niceboard-new-job",
  name: "New Job Published",
  description: "Emit new event each time a new job is published in Niceboard",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvent(max) {
      const jobs = [];
      const newJobs = this.paginate({
        fn: this.niceboard.listJobs,
        max,
      });
      for await (const job of newJobs) {
        jobs.push(job);
      }
      if (!jobs?.length) {
        return;
      }
      this._setLastId(+jobs[0].id);
      this.emitEvents(jobs);
    },
    getResults({ results }) {
      return results.jobs;
    },
    getTotalPages({ results }) {
      return results.pages.total;
    },
    generateMeta(job) {
      return {
        id: job.id,
        summary: `New Job: ${job.title}`,
        ts: Date.parse(job.published_at),
      };
    },
  },
};
