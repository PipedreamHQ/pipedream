import rss from "../../rss.app.mjs";
import { Item } from "feedparser";
import {
  Source, UserProp,
} from "@pipedream/types";

export default {
  key: "rss-new-item-in-feed",
  name: "New Item in Feed",
  description: "Emit new items from an RSS feed",
  version: "1.0.5",
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
  hooks: {
    async activate() {
      // Try to parse the feed one time to confirm we can fetch and parse.
      // The code will throw any errors to the user.
      await this.rss.fetchAndParseFeed(this.url);
    },
  },
  async run() {
    const items = await this.rss.fetchAndParseFeed(this.url);
    items.forEach((item: Item) => {
      this.$emit(item, {
        id: this.rss.itemKey(item),
        summary: item.title,
        ts: item.pubdate && +new Date(item.pubdate),
      });
    });
  },
} as Source;
