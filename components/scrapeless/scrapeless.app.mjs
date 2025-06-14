import { axios } from "@pipedream/platform";
import {
  isObject, log, isNullOrUnDef,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "scrapeless",
  methods: {
    _baseUrl() {
      return "https://api.scrapeless.com/api/v1";
    },
    _headers() {
      return {
        "x-api-token": `${this.$auth.api_key}`,
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
        path: "/scraper/request",
        ...opts,
      });
    },
    getScrapeResult({ scrapeJobId }) {
      return this._makeRequest({
        path: `/scraper/result/${scrapeJobId}`,
      });
    },
    async scrapingApi({ submitData }) {
      const path = "/scraper/request";
      const requestWithSync = {
        ...submitData,
        async: true,
      };
      const res = await this._makeRequest({
        method: "POST",
        path,
        data: requestWithSync,
      });

      if (res.data) {
        return res.data;
      }

      if (res?.taskId) {
        log("Waiting for scrape result...");

        while (true) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const result = await this.getScrapeResult({
            scrapeJobId: res.taskId,
          });

          if (isObject(result) && Object.keys(result).length > 0) {
            log("Scrape result received");
            return result;
          }

          if (isNullOrUnDef(result)) {
            log("Scrape result is undefined");
            return result;
          }
        }
      }
      return res;
    },
    async universalScrapingApi({ submitData }) {
      const path = "/unlocker/request";
      const res = await this._makeRequest({
        method: "POST",
        path,
        data: submitData,
      });

      if (res.data) {
        return res.data;
      }

      return res;
    },
    async crawlerCrawl({ submitData }) {
      const path = "/crawler/crawl";

      const browserOptions = {
        "proxy_country": "ANY",
        "session_name": "Crawl",
        "session_recording": true,
        "session_ttl": 900,
      };

      const data = {
        url: submitData.url,
        limit: submitData.limit,
        browserOptions: browserOptions,
      };

      const res = await this._makeRequest({
        method: "POST",
        path,
        data,
      });

      // get job id
      if (res.id) {
        log("Crawl job started");
        return this.monitorJobStatus(res.id);
      }

      return res;
    },
    /**
     * Monitor the status of a crawl job.
     * @param {string} jobId - The ID of the crawl job.
     * @param {number} [pollInterval=2] - The interval in seconds to poll for job status.
     * @returns {Promise<Object>} - The status response of the crawl job.
     */
    async monitorJobStatus(jobId, pollInterval = 2) {
      try {
        while (true) {
          let statusResponse = await this._makeRequest({
            method: "GET",
            path: `/crawler/crawl/${jobId}`,
          });
          log("Crawl job status: ", statusResponse.status);
          if (statusResponse.status === "completed") {
            if ("data" in statusResponse) {
              let data = statusResponse.data;
              while (typeof statusResponse === "object" && "next" in statusResponse) {
                if (data.length === 0) break;
                statusResponse = await this._makeRequest({
                  method: "GET",
                  path: statusResponse.next,
                });
                data = data.concat(statusResponse.data);
              }
              statusResponse.data = data;
              return statusResponse;
            } else {
              throw new Error("Crawl job completed but no data was returned");
            }
          } else if ([
            "active",
            "paused",
            "pending",
            "queued",
            "waiting",
            "scraping",
          ].includes(statusResponse.status)) {
            pollInterval = Math.max(pollInterval, 2);
            await new Promise((resolve) => setTimeout(resolve, pollInterval * 1000));
          } else {
            throw new Error(`Crawl job failed or was stopped. Status: ${statusResponse.status}`);
          }
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async crawlerScrape({ submitData }) {
      const path = "/crawler/scrape";
      const browserOptions = {
        "proxy_country": "ANY",
        "session_name": "Scrape",
        "session_recording": true,
        "session_ttl": 900,
      };

      const data = {
        url: submitData.url,
        browserOptions: browserOptions,
      };

      try {
        const response = await this._makeRequest({
          method: "POST",
          path,
          data,
        });

        if (!response.id) {
          throw new Error("Failed to start a scrape job");
        }

        log("Scrape job started");

        let pollInterval = 2;

        while (true) {
          const statusResponse = await this.checkScrapeStatus(response.id);
          log("Scrape job status: ", statusResponse.status);
          if (statusResponse.status !== "scraping") {
            return statusResponse;
          }

          pollInterval = Math.max(pollInterval, 2);
          await new Promise((resolve) => setTimeout(resolve, pollInterval * 1000));
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },

    /**
     * Check the status of a crawl job.
     * @param {string} id - The ID of the crawl job.
     * @returns {Promise<Object>} - The status response of the crawl job.
     */
    async checkScrapeStatus(id) {
      if (!id) {
        throw new Error("No scrape ID provided");
      }
      const url = `/crawler/scrape/${id}`;
      try {
        const response = await this._makeRequest({
          method: "GET",
          path: url,
        });
        return response;
      } catch (error) {
        throw new Error(error.message);
      }
    },

  },

};
