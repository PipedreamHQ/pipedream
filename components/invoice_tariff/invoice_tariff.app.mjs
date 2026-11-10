import { axios } from "@pipedream/platform";
import { parseRssItems } from "./common/utils.mjs";

export default {
  type: "app",
  app: "invoice_tariff",
  methods: {
    _baseUrl() {
      return "https://invoicetariff.com";
    },
    async _makeRequest($, path, params = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params,
        headers: {
          "Accept": "application/json",
        },
      });
    },
    async searchHtsCodes($, query) {
      return this._makeRequest($, "/api/hts/search", { q: query });
    },
    async getTariffRadarFeed($) {
      const feed = await axios($, {
        url: `${this._baseUrl()}/radar/feed.xml`,
        headers: {
          "Accept": "application/rss+xml, application/xml, text/xml",
        },
      });
      return parseRssItems(feed);
    },
  },
};
