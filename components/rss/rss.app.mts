import axios from "axios";
import FeedParser from "feedparser";
import { Item } from "feedparser";
import hash from "object-hash";
import {
  NoProtocolError, generateHTTPErrorClasses,
} from "@pipedream/helpers";
import {
  App, UserProp,
} from "@pipedream/types";

export default {
  type: "app",
  app: "rss",
  propDefinitions: {
    url: {
      type: "string",
      label: "Feed URL",
      description: "Enter the URL for any public RSS feed",
    } as UserProp,
  },
  methods: {
    // in theory if alternate setting title and description or aren't unique this won't work
    itemKey(item = {} as Item): string {
      return item.guid ?? hash(item);
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
      const errors = generateHTTPErrorClasses();
      if (res.status === 404) throw errors[404]("The URL does not exist. Please double-check the URL and try again.");
      if (res.status === 429) throw errors[429](`${this.url} rate-limited the request. Please reach out to the site hosting the RSS feed to confirm or increase their rate limit.`);
      if (res.status >= 500) throw errors[res.status](`${this.url} encountered an error. Please try again later or reach out to the site hosting the RSS feed if you continue to see this error.`);
      if (res.status >= 400) {
        throw errors[res.status]("Error fetching URL. Please check the URL and try again.");
      }
      return res.data;
    },
    async parseFeed(data: any) {
      const feedparser = new FeedParser({
        addmeta: false,
      });
      const items: Item[] = [];
      await new Promise((resolve, reject) => {
        feedparser.on("error", reject);
        feedparser.on("end", resolve);
        feedparser.on("readable", function(this: FeedParser) {
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
    async fetchAndParseFeed(url: string) {
      this.validateFeedURL(url);
      const data = await this.fetchFeed(url);
      return this.parseFeed(data);
    },
    validateFeedURL(url: string) {
      if (!url) throw new Error("No feed URL provided");
      if (!/^(?:(ht|f)tp(s?):\/\/)/.test(url)) throw new NoProtocolError("The feed URL must start with a protocol like http:// or https://");
    },
  },
} as App;
