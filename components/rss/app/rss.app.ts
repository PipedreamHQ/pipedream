import {
  axios, ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import { defineApp } from "@pipedream/types";
import FeedParser, { Item } from "feedparser";
import { ReadStream } from "fs";
import hash from "object-hash";

export default defineApp({
  type: "app",
  app: "rss",
  propDefinitions: {
    url: {
      type: "string",
      label: "Feed URL",
      description: "Enter the URL for any public RSS feed",
    },
    urls: {
      type: "string[]",
      label: "Feed URLs",
      description: "Enter either one or multiple URLs from any public RSS feed",
    },
    timer: {
      type: "$.interface.timer",
      description: "How often you want to poll the feed for new items",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    // in theory if alternate setting title and description or aren't unique this won't work
    itemTs(item = {} as (Item | any)): number {
      const {
        pubdate, pubDate, date_published,
      } = item;
      const itemPubDate = pubdate ?? pubDate ?? date_published;
      if (itemPubDate) {
        return +new Date(itemPubDate);
      }
      return +new Date();
    },
    itemKey(item = {} as (Item | any)): string {
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
    async fetchFeed(url: string): Promise<any> {
      const res = await axios(this, {
        url,
        method: "GET",
        headers: {
          "accept": "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8, application/json, application/feed+json",
        },
        validateStatus: () => true, // does not throw on any bad status code
        responseType: "stream", // stream is required for feedparser
        returnFullResponse: true,
      });

      // Handle status codes as error codes
      if (res.status === 404) throw new ConfigurationError(`The URL ${url} does not exist. Please double-check the URL and try again.`);
      if (res.status === 429) throw new ConfigurationError(`${url} isn't returning a valid feed because requests have been rate-limited. Please reach out to the site hosting the RSS feed to confirm or increase their rate limit.`);
      if (res.status >= 500) throw new ConfigurationError(`${url} is returning a server error. Please try again later or reach out to the site hosting the RSS feed if you continue to see this error.`);
      if (res.status >= 400) {
        throw new ConfigurationError(`Error fetching URL ${url}. Please load the URL directly in your browser and try again.`);
      }
      return {
        data: res.data,
        contentType: res.headers["content-type"],
      };
    },
    async parseFeed(stream: ReadStream): Promise<Item[]> {
      const feedparser = new FeedParser({
        addmeta: true,
      });
      const items: Item[] = [];
      await new Promise((resolve, reject) => {
        feedparser.on("error", reject);
        feedparser.on("end", resolve);
        feedparser.on("readable", function (this: FeedParser) {
          let item: any = this.read();

          while (item) {
            /*
            Valid escaped entries in RSS are being stripped out, see issue:
            https://github.com/danmactough/node-feedparser/issues/243
            Author suggests using the values below, so I check for them,
            if they exist, overwrite title.
            */
            if (item["atom:title"] && item["atom:title"]["#"]) {
              item.title = item["atom:title"]["#"];
            } else if (item["rss:title"] && item["rss:title"]["#"]) {
              item.title = item["rss:title"]["#"];
            }
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
    isJSONFeed(response: any): boolean {
      const acceptedJsonFeedMimes = [
        "application/feed+json",
        "application/json",
      ];
      return acceptedJsonFeedMimes.includes(response?.contentType?.toLowerCase());
    },
    async parseJSONFeed(stream: ReadStream): Promise<Item[]> {
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const _buf = [];
        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));
      });
      const contentString = buffer.toString();
      const feed = JSON.parse(contentString);
      return feed?.items || [];
    },
    async fetchAndParseFeed(u: string) {
      const url = this.validateAndFixFeedURL(u);
      const response = await this.fetchFeed(url);
      if (this.isJSONFeed(response)) {
        return await this.parseJSONFeed(response.data);
      } else {
        return await this.parseFeed(response.data);
      }
    },
    validateAndFixFeedURL(u: string) {
      if (!u) throw new ConfigurationError("No URL provided. Please enter an RSS URL to fetch");
      let url = u;
      // If the URL doesn't begin with a protocol, the request will fail.
      if (!/^(?:(ht|f)tp(s?):\/\/)/.test(url)) {
        url = `https://${u}`;
      }
      return url;
    },
    sortItems(items) {
      return items.sort((itemA: any, itemB: any) => {
        if (this.itemTs(itemA) > this.itemTs(itemB)) {
          return 1;
        }
        return -1;
      });
    },
    sortItemsForActions(items) {
      return this.sortItems(items).reverse();
    },
  },
});
