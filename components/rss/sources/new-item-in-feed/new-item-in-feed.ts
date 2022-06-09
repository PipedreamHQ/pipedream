import rss from "../../app/rss.app";
import { defineSource } from "@pipedream/types";

export default defineSource({
  key: "rss-new-item-in-feed",
  name: "New Item in Feed",
  description: "Emit new items from an RSS feed",
  version: "1.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    url: {
      type: "string",
      label: "Feed URL",
      description: "Enter the URL for any public RSS feed",
    },
    timer: {
      type: "$.interface.timer",
      description: "How often you want to poll the feed for new items",
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
    items.forEach((item: any) => {
      this.$emit(item, {
        id: this.rss.itemKey(item),
        summary: item.title,
        ts: item.pubdate && +new Date(item.pubdate),
      });
    });
  },
});
