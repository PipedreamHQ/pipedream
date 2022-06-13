import rss from "../../app/rss.app";
import { defineSource } from "@pipedream/types";

export default defineSource({
  key: "rss-new-item-from-multiple-feeds",
  name: "New item from multiple RSS feeds",
  type: "source",
  description: "Emit new items from multiple RSS feeds",
  version: "1.0.1",
  props: {
    rss,
    urls: {
      type: "string[]",
      label: "Feed URLs",
      description: "Enter either one or multiple URLs from any public RSS feed",
    },
    timer: {
      type: "$.interface.timer",
      description: "How often you want to poll the feed for new items",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  dedupe: "unique",
  hooks: {
    async activate() {
      // Try to parse the feed one time to confirm we can fetch and parse.
      // The code will throw any errors to the user.
      for (const url of this.urls) {
        await this.rss.fetchAndParseFeed(url);
      }
    },
  },
  async run() {
    for (const url of this.urls) {
      const items = await this.rss.fetchAndParseFeed(url);
      items.forEach((item: any) => {
        this.$emit(item, {
          id: this.rss.itemKey(item),
          summary: item.title,
          ts: item.pubdate && +new Date(item.pubdate),
        });
      });
    }
  },
});
