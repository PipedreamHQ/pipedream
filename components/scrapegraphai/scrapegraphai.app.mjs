import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scrapegraphai",
  version: "0.0.{ts}",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL to Scrape",
      description: "The URL of the website to scrape.",
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the scraping job.",
    },
    dataFields: {
      type: "string[]",
      label: "Data Fields",
      description: "Optional data fields to extract from the scraped content.",
      optional: true,
    },
    paginationSettings: {
      type: "string[]",
      label: "Pagination Settings",
      description: "Optional pagination settings for the scraping job.",
      optional: true,
    },
    headers: {
      type: "string[]",
      label: "Headers",
      description: "Optional headers to include in the scraping request.",
      optional: true,
    },
    filterDataFields: {
      type: "string[]",
      label: "Filter Data Fields",
      description: "Optional data fields to filter the results.",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the scraping task to monitor.",
      optional: true,
    },
    scrapingJobFilter: {
      type: "string",
      label: "Scraping Job Filter",
      description: "Filter events by specific scraping jobs.",
      optional: true,
    },
    dataTypeFilter: {
      type: "string",
      label: "Data Type Filter",
      description: "Filter events by specific data types.",
      optional: true,
    },
    scrapingTaskNameFilter: {
      type: "string",
      label: "Scraping Task Name Filter",
      description: "Filter events by specific scraping task names.",
      optional: true,
    },
    errorTypeFilter: {
      type: "string",
      label: "Error Type Filter",
      description: "Filter error events by specific error types.",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.scrapegraphai.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async startScrapingJob(opts = {}) {
      const {
        url,
        dataFields,
        paginationSettings,
        headers,
        ...otherOpts
      } = opts;
      const data = {
        url: this.url,
      };
      if (this.dataFields) {
        data.data_fields = this.dataFields.map(JSON.parse);
      }
      if (this.paginationSettings) {
        data.pagination_settings = this.paginationSettings.map(JSON.parse);
      }
      if (this.headers) {
        data.headers = this.headers.map(JSON.parse);
      }
      return this._makeRequest({
        method: "POST",
        path: "/smartscraper/start",
        data,
        ...otherOpts,
      });
    },
    async retrieveScrapingResults(opts = {}) {
      const {
        jobId, filterDataFields, ...otherOpts
      } = opts;
      const params = {
        job_id: this.jobId,
      };
      if (this.filterDataFields) {
        params.filter_data_fields = this.filterDataFields;
      }
      return this._makeRequest({
        method: "GET",
        path: "/smartscraper/get-results",
        params,
        ...otherOpts,
      });
    },
    async stopScrapingJob(opts = {}) {
      const {
        jobId, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/smartscraper/stop",
        data: {
          job_id: this.jobId,
        },
        ...otherOpts,
      });
    },
    async onTaskCompleted(opts = {}) {
      const {
        taskId, scrapingJobFilter, ...otherOpts
      } = opts;
      const params = {};
      if (this.taskId) {
        params.task_id = this.taskId;
      }
      if (this.scrapingJobFilter) {
        params.scraping_job = this.scrapingJobFilter;
      }
      return this._makeRequest({
        method: "GET",
        path: "/events/task-completed",
        params,
        ...otherOpts,
      });
    },
    async onNewDataAvailable(opts = {}) {
      const {
        dataTypeFilter, scrapingTaskNameFilter, ...otherOpts
      } = opts;
      const params = {};
      if (this.dataTypeFilter) {
        params.data_type = this.dataTypeFilter;
      }
      if (this.scrapingTaskNameFilter) {
        params.scraping_task_name = this.scrapingTaskNameFilter;
      }
      return this._makeRequest({
        method: "GET",
        path: "/events/new-data",
        params,
        ...otherOpts,
      });
    },
    async onErrorOccurred(opts = {}) {
      const {
        errorTypeFilter, scrapingJobFilter, ...otherOpts
      } = opts;
      const params = {};
      if (this.errorTypeFilter) {
        params.error_type = this.errorTypeFilter;
      }
      if (this.scrapingJobFilter) {
        params.scraping_job = this.scrapingJobFilter;
      }
      return this._makeRequest({
        method: "GET",
        path: "/events/error",
        params,
        ...otherOpts,
      });
    },
    async paginate(fn, ...opts) {
      const results = [];
      const fetchPage = async (page = 1) => {
        const response = await fn({
          page,
          ...opts,
        });
        if (response && response.items && response.items.length > 0) {
          results.push(...response.items);
          if (response.has_more) {
            await fetchPage(page + 1);
          }
        }
      };
      await fetchPage();
      return results;
    },
  },
};
