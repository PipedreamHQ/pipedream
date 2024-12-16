import common from "../common/base.mjs";

export default {
  ...common,
  key: "niceboard-new-job-seeker",
  name: "New Job Seeker",
  description: "Emit new event when a new job seeker account is registered",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvent(max) {
      let jobSeekers = [];
      const newJobSeekers = this.paginate({
        fn: this.niceboard.listJobSeekers,
      });
      for await (const jobseeker of newJobSeekers) {
        jobSeekers.push(jobseeker);
      }
      if (!jobSeekers?.length) {
        return;
      }
      jobSeekers = this.getMaxResults(jobSeekers, max);
      this._setLastId(+jobSeekers[jobSeekers.length - 1].id);
      this.emitEvents(jobSeekers);
    },
    getResults(response) {
      return response.jobs;
    },
    getTotalPages(response) {
      return response.total_pages;
    },
    generateMeta(jobseeker) {
      return {
        id: jobseeker.id,
        summary: `New Job Seeker: ${jobseeker.first_name} ${jobseeker.last_name}`,
        ts: Date.parse(jobseeker.last_indexed_at),
      };
    },
  },
};
