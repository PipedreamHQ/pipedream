import common from "../common/base.mjs";

export default {
  ...common,
  key: "splunk-new-search-result",
  name: "New Search Result",
  description: "Emit new events when a search returns results in Splunk. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#saved.2Fsearches)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getRecentJobs() {
      const jobs = [];
      const results = this.splunk.paginate({
        resourceFn: this.splunk.listJobs,
      });
      for await (const job of results) {
        jobs.push(job);
      }
      return jobs;
    },
    generateMeta(result) {
      return {
        id: result.id,
        summary: `New Search with ID: ${result.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const jobs = await this.getRecentJobs();
    for (const job of jobs) {
      if (job.content?.resultCount > 0) {
        const { results } = await this.splunk.getSearchResults({
          jobId: job.content.sid,
        });
        if (results) {
          job.results = results;
        }
      }
    }
    jobs.forEach((result) => {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    });
  },
};
