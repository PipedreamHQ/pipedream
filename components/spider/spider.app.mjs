import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "spider",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL to Scrape",
      description: "The URL of the page to scrape.",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.spider.cloud";
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async initiateCrawl() {
      const response = await this._makeRequest({
        method: "POST",
        path: "/crawl",
        data: {
          url: this.url,
        },
      });
      if (Array.isArray(response) && response.length > 0) {
        return response[0].content;
      }
      throw new Error("No content returned from crawl");
    },
  },
};
