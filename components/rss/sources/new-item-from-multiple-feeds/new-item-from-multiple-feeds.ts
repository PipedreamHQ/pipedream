import rss from "../../app/rss.app";
import { defineSource } from "@pipedream/types";
import rssCommon from "../common/common";

export default defineSource({
  ...rssCommon,
  key: "rss-new-item-from-multiple-feeds",
  name: "New item from multiple RSS feeds",
  type: "source",
  description: "Emit new items from multiple RSS feeds",
  version: "1.0.3",
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
    this.rss.sortItems(items).forEach((item: any) => {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    });
  },
});
