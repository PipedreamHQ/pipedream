import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scrapeless",
  propDefinitions: {
    targetUrl: {
      type: "string",
      label: "Target URL",
      description: "The URL of the web page to scrape",
    },
    selectors: {
      type: "string[]",
      label: "Selectors",
      description: "An array of CSS selectors to extract data from the web page",
    },
    scrapeJobId: {
      type: "string",
      label: "Scrape Job ID",
      description: "The ID of the scrape job to monitor or retrieve results",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.scrapeless.com/api/v1";
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
          "x-api-token": this.$auth.api_token,
          ...headers,
        },
      });
    },
    async submitScrapeJob({
      targetUrl, selectors, proxyCountry = "US", async = true,
    }) {
      const response = await this._makeRequest({
        method: "POST",
        path: "/scraper/request",
        data: {
          actor: "custom_scraper",
          input: {
            url: targetUrl,
            selectors: selectors,
          },
          proxy: {
            country: proxyCountry,
          },
          async: async,
        },
      });
      this.$emit(response, {
        name: "new_scrape_job_submitted",
      });
      return response;
    },
    async getScrapeResult({ scrapeJobId }) {
      return this._makeRequest({
        path: `/scraper/result/${scrapeJobId}`,
      });
    },
    async monitorScrapeJob(scrapeJobId) {
      try {
        const result = await this.getScrapeResult({
          scrapeJobId,
        });
        if (result.state === "completed") {
          this.$emit(result, {
            name: "scrape_job_completed",
          });
        } else if (result.state === "failed") {
          this.$emit(result, {
            name: "scrape_job_failed",
          });
        }
      } catch (error) {
        this.$emit({
          error: error.message,
          scrapeJobId,
        }, {
          name: "scrape_job_failed",
        });
        throw error;
      }
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
