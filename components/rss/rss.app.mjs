import { axios } from "@pipedream/platform";
import FeedParser from "feedparser";
import hash from "object-hash";
import stringToStream from "string-to-stream";

export default {
  type: "app",
  app: "rss",
  methods: {
    itemKey(item) {
      return hash(item);
    },
    _getHeaders() {
      return {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36",
        "accept": "text/html,application/xhtml+xml",
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: opts.path,
        headers: this._getHeaders(),
      };
    },
    async fetchFeed(ctx = this, url) {
      const feed = await axios(ctx, this._getRequestParams({
        method: "GET",
        path: url,
      }));
      return feed;
    },
    async parseFeed(feed) {
      const feedParser = new FeedParser({
        addmeta: false,
      });
      const items = [];
      await new Promise((resolve, reject) => {
        feedParser.on("error", reject);
        feedParser.on("end", resolve);
        feedParser.on("readable", function () {
          let item;
          const readAndAssign = () => {
            item = this.read();
            return Boolean(item);
          };
          while (readAndAssign()) {
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
          }
        });
        stringToStream(feed).pipe(feedParser);
      });
      return items;
    },
  },
};
