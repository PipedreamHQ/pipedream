import axios from "axios";
import FeedParser from "feedparser";
import { Item } from "feedparser";
import hash from "object-hash";
import { defineApp } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "rss",
  propDefinitions: {
    url: {
      type: "string",
      label: "Feed URL",
      description: "Enter the URL for any public RSS feed",
    },
  },
  methods: {
    // in theory if alternate setting title and description or aren't unique this won't work
    itemKey(item = {} as Item): string {
      if (item.pubdate && item.guid) {
        return `${item.pubdate}-${item.guid}`;
      }
      return hash(item);
    },
    async fetchFeed(url: string): Promise<any> {
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
      if (res.status === 404) throw new ConfigurationError(`The URL ${url} does not exist. Please double-check the URL and try again.`);
      if (res.status === 429) throw new ConfigurationError(`${url} isn't returning a valid feed because requests have been rate-limited. Please reach out to the site hosting the RSS feed to confirm or increase their rate limit.`);
      if (res.status >= 500) throw new ConfigurationError(`${url} is returning a server error. Please try again later or reach out to the site hosting the RSS feed if you continue to see this error.`);
      if (res.status >= 400) {
        throw new ConfigurationError(`Error fetching URL ${url}. Please load the URL directly in your browser and try again.`);
      }
      return res.data;
    },
    async parseFeed(data: any): Promise<Item[]> {
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
    async fetchAndParseFeed(u: string) {
      this.validateFeedURL(u);
      let url = u;
      // If the URL doesn't begin with a protocol, the request will fail.
      if (!/^(?:(ht|f)tp(s?):\/\/)/.test(url)) {
        url = `https://${u}`;
      }
      const data = await this.fetchFeed(url);
      return await this.parseFeed(data);
    },
    validateFeedURL(url: string) {
      if (!url) throw new ConfigurationError("No URL provided. Please enter an RSS URL to fetch");
    },
  },
});
