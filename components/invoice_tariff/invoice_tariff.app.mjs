import { axios } from "@pipedream/platform";

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
      const decode = (value) =>
        String(value)
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, "\"")
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, "&");
      const blocks = String(feed).match(/<item>[\s\S]*?<\/item>/g) ?? [];
      return blocks.map((block) => {
        const pick = (tag) =>
          block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1]?.trim() ?? "";
        return {
          title: decode(pick("title")),
          link: decode(pick("link")),
          pubDate: pick("pubDate"),
          summary: decode(pick("description")),
        };
      });
    },
  },
};
