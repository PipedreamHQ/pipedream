import common from "../common/base.mjs";

export default {
  ...common,
  key: "webscraper_io-new-scraping-completed",
  name: "New Scraping Completed",
  description: "Emit new event when a page scraping job has completed. [See the docs here](https://webscraper.io/documentation/web-scraper-cloud/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const jobs = await this.getScrapingJobs();
      if (!(jobs?.length > 0)) {
        return;
      }
      jobs.reverse().slice(0, limit)
        .forEach((job) => this.emitEvent(job));
    },
    isRelevant(job, previousIds) {
      return job.status === "finished" && !previousIds[job.id];
    },
    emitEvent(job) {
      const meta = this.generateMeta(job);
      this.$emit(job, meta);
    },
    generateMeta(job) {
      return {
        id: job.id,
        summary: job.sitemap_name,
        ts: job.time_created,
      };
    },
    async getScrapingJobs() {
      const jobs = [];
      const previousIds = this._getPreviousIds();

      const results = await this.webscraper.paginate(this.webscraper.getScrapingJobs);
      for (const job of results) {
        if (this.isRelevant(job, previousIds)) {
          previousIds[job.id] = true;
          jobs.push(job);
        }
      }

      this._setPreviousIds(previousIds);

      return jobs;
    },
  },
  async run() {
    const jobs = await this.getScrapingJobs();
    jobs.forEach((job) => this.emitEvent(job));
  },
};
