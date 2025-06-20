import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scrapeless",
  methods: {
    _baseUrl() {
      return "https://scrapeless-nodes.norains.com/api/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    submitScrapeJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/nodes/scraper/request",
        ...opts,
      });
    },
    getScrapeResult({ scrapeJobId }) {
      return this._makeRequest({
        path: `/nodes/scraper/result/${scrapeJobId}`,
      });
    },
    async scrapingApi({ submitData }) {
      const path = "/nodes/deepserp";
      const res = await this._makeRequest({
        method: "POST",
        path,
        data: submitData,
      });

      return res;
    },
    async universalScrapingApi({ submitData }) {
      const path = "/nodes/universal-scraping/unlocker";
      const res = await this._makeRequest({
        method: "POST",
        path,
        data: submitData,
      });
      return res;
    },
    async crawlerCrawl({ submitData }) {
      const path = "/nodes/crawler/crawl";

      const data = {
        url: submitData.url,
        limit: submitData.limit,
      };

      const res = await this._makeRequest({
        method: "POST",
        path,
        data,
      });

      return res;
    },
    async crawlerScrape({ submitData }) {
      const path = "/nodes/crawler/scrape";

      const data = {
        url: submitData.url,
      };

      try {
        const response = await this._makeRequest({
          method: "POST",
          path,
          data,
        });
        return response;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

};
