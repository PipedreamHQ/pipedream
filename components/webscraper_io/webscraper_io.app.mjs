import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "webscraper_io",
  propDefinitions: {
    sitemapId: {
      type: "string",
      label: "Sitemap ID",
      description: "Identifier of a sitemap",
      async options({ page }) {
        const { data } = await this.getSitemaps({
          params: page + 1,
        });
        return data?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.webscraper.io/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          api_token: this.$auth.api_key,
        },
        ...args,
      });
    },
    getSitemaps(args = {}) {
      return this._makeRequest({
        path: "/sitemaps",
        ...args,
      });
    },
    getScrapingJobs(args = {}) {
      return this._makeRequest({
        path: "/scraping-jobs",
        ...args,
      });
    },
    createSitemap(args = {}) {
      return this._makeRequest({
        path: "/sitemap",
        method: "POST",
        ...args,
      });
    },
    createScrapingJob(args = {}) {
      return this._makeRequest({
        path: "/scraping-job",
        method: "POST",
        ...args,
      });
    },
    async paginate(resourceFn, params = {}, maxResults = 1000) {
      let page = 1;
      const jobs = [];

      while (true) {
        const {
          data, current_page: currentPage, last_page: lastPage,
        } = await resourceFn({
          params: {
            ...params,
            page,
          },
        });
        jobs.push(...data);
        if (currentPage === lastPage || jobs.length >= maxResults) {
          break;
        }
        page++;
      }

      if (jobs.length > maxResults) {
        jobs.length = maxResults;
      }

      return jobs;
    },
  },
};
