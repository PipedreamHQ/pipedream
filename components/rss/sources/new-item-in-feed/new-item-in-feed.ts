import rss from "../../rss.app";
import axios from "axios";
import FeedParser from "feedparser";
import hash from "object-hash";
import {
  defineSource, UserProp, SourceRunThis,
} from "@pipedream/types";

class NoProtocolError extends Error {
  constructor (message: string) {
    super(message);

    // assign the error class name in your custom error (as a shortcut)
    this.name = this.constructor.name;

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);
  }
}

export default defineSource({
  key: "rss-new-item-in-feed",
  name: "New Item in Feed",
  description: "Emit new items from an RSS feed",
  version: "1.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    url: {
      type: "string",
      label: "Feed URL",
      description: "Enter the URL for any public RSS feed",
    } as UserProp,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    rss,
  },
  methods: {
    // in theory if alternate setting title and description or aren't unique this won't work
    itemKey(item = {} as FeedParser.Item): string {
      // XXX Do the RSS feeds truly not contain an id in items?
      return item.guid ?? item.id ?? hash(item);
    },
    async fetchFeed(url: string) {
      const res = await axios({
        url,
        method: "GET",
        headers: {
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "accept": "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
        },
        validateStatus: () => true, // does not throw on any bad status code
        responseType: "stream", // stream is required for feedparser
      });
      // Handle status codes as error codes
      const errors = this.rss.generateHTTPErrorClasses();
      if (res.status === 404) throw new errors[404]("The URL does not exist. Please double-check the URL and try again.");
      if (res.status === 429) throw new errors[429](`${this.url} rate-limited the request. Please reach out to the site hosting the RSS feed to confirm or increase their rate limit.`);
      if (res.status >= 500) throw new errors[res.status](`${this.url} encountered an error. Please try again later or reach out to the site hosting the RSS feed if you continue to see this error.`);
      if (res.status >= 400) {
        throw new errors[res.status]("Error fetching URL. Please check the URL and try again.");
      }
      return res;
    },
    async parseFeed(data) {
      const feedparser = new FeedParser({
        addmeta: false,
      });
      const items = [];
      await new Promise((resolve, reject) => {
        feedparser.on("error", reject);
        feedparser.on("end", resolve);
        feedparser.on("readable", function() {
          let item = this.read;
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
        data.pipe(feedparser);
      });
      return items;
    },
    async fetchAndParseFeed(url) {
      this.validateFeedURL(url);
      const res = await this.fetchFeed(url);
      return this.parseFeed(res.data);
    },
    validateFeedURL(url) {
      if (!url) throw new Error("No feed URL provided");
      if (!url.match(/^(?:(ht|f)tp(s?):\/\/)?/)) throw new NoProtocolError("The feed URL must start with a protocol like http:// or https://");
    },
  },
  hooks: {
    async activate() {
      // Try to parse the feed one time to confirm we can fetch and parse.
      // The code will throw any errors to the user.
      await this.fetchAndParseFeed(this.url);
    },
  },
  async run() {

    const items = await this.fetchAndParseFeed(this.url);
    items.forEach((item) => {
      this.$emit(item, {
        id: this.itemKey(item),
        summary: item.title,
        ts: item.pubdate && +new Date(item.pubdate),
      });
    });
  },
});
