import common from "../common/base.mjs";

export default {
  ...common,
  key: "webscraper-new-scraping-completed",
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
      const previousIds = this._getPreviousIds();
      let page = 1;
      const jobs = [];

      while (true) {
        const {
          data, current_page: currentPage, last_page: lastPage,
        } = await this.webscraper.getScrapingJobs({
          params: {
            page,
          },
        });
        for (const job of data) {
          if (this.isRelevant(job, previousIds)) {
            previousIds[job.id] = true;
            jobs.push(job);
          }
        }
        if (currentPage === lastPage) {
          break;
        }
        page++;
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
