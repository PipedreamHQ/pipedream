import rss from "../../app/rss.app";
import { defineSource } from "@pipedream/types";
import rssCommon from "../common/common";

export default defineSource({
  ...rssCommon,
  key: "rss-random-item-in-multiple-feeds",
  name: "Random item from multiple RSS feeds",
  type: "source",
  description: "Emit a random item from multiple RSS feeds",
  version: "0.0.2",
  props: {
    ...rssCommon.props,
    urls: {
      propDefinition: [
        rss,
        "urls",
      ],
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
    const items = [];
    for (const url of this.urls) {
      const feedItems = await this.rss.fetchAndParseFeed(url);
      items.push(...feedItems);
    }
    const item = items[Math.floor(Math.random() * items.length)];
    const meta = this.generateMeta(item);
    this.$emit(item, meta);
  },
});
