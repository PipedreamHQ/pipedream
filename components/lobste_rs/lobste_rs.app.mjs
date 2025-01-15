import { axios } from "@pipedream/platform";
import FeedParser from "feedparser";
import hash from "object-hash";

export default {
  type: "app",
  app: "lobste_rs",
  propDefinitions: {},
  methods: {
    makeRequest({
      $ = this, ...config
    }) {
      return axios($, config);
    },
    itemTs(item = {}) {
      const {
        pubdate, pubDate, date_published,
      } = item;
      const itemPubDate = pubdate ?? pubDate ?? date_published;
      if (itemPubDate) {
        return +new Date(itemPubDate);
      }
      return +new Date();
    },
    itemKey(item = {}) {
      const {
        id, guid, link, title,
      } = item;
      const itemId = id ?? guid ?? link ?? title;
      if (itemId) {
        // reduce itemId length for deduping
        return itemId.length > 64
          ? itemId.slice(-64)
          : itemId;
      }
      return hash(item);
    },
    async fetchFeed(url) {
      const res = await axios(this, {
        url,
        method: "GET",
        headers: {
          "accept": "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8, application/json, application/feed+json",
        },
        responseType: "stream", // stream is required for feedparser
        returnFullResponse: true,
      });
      return {
        data: res.data,
        contentType: res.headers["content-type"],
      };
    },
    async parseFeed(stream) {
      const feedparser = new FeedParser({
        addmeta: true,
      });
      const items = [];
      await new Promise((resolve, reject) => {
        feedparser.on("error", reject);
        feedparser.on("end", resolve);
        feedparser.on("readable", function () {
          let item = this.read();

          while (item) {
            for (const k in item) {
              if (item[`rss:${k}`]) {
                delete item[`rss:${k}`];
                continue;
              }
              const o = item[k];
              if (o == null || (typeof o === "object" && !Object.keys(o).length) || Array.isArray(o) && !o.length) {
                delete item[k];
                continue;
              }
            }
            items.push(item);
            item = this.read();
          }
        });
        stream.pipe(feedparser);
      });
      return items;
    },
    isJSONFeed(response) {
      const acceptedJsonFeedMimes = [
        "application/feed+json",
        "application/json",
      ];
      return acceptedJsonFeedMimes.includes(response?.contentType?.toLowerCase());
    },
    async parseJSONFeed(stream) {
      const buffer = await new Promise((resolve, reject) => {
        const _buf = [];
        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));
      });
      const contentString = buffer.toString();
      const feed = JSON.parse(contentString);
      return feed?.items || [];
    },
    async fetchAndParseFeed(url) {
      const response = await this.fetchFeed(url);
      if (this.isJSONFeed(response)) {
        return await this.parseJSONFeed(response.data);
      } else {
        return await this.parseFeed(response.data);
      }
    },
  },
};
