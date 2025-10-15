import { defineSource } from "@pipedream/types";
import rss from "../../app/rss.app";
import rssCommon from "../common/common";

export default defineSource({
  ...rssCommon,
  key: "rss-new-item-from-multiple-feeds",
  name: "New Item From Multiple RSS Feeds",
  type: "source",
  description: "Emit new items from multiple RSS feeds",
  version: "1.2.8",
  props: {
    ...rssCommon.props,
    urls: {
      propDefinition: [
        rss,
        "urls",
      ],
      description: "Enter one or multiple URLs from any public RSS feed. To avoid timeouts, 5 or less URLs is recommended.",
    },
    max: {
      type: "integer",
      label: "Max per Feed",
      description: "Maximum number of posts per feed to retrieve at one time. Defaults to 20.",
      optional: true,
      default: 20,
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
      const feedItems = (await this.rss.fetchAndParseFeed(url))?.slice(0, this.max);
      console.log(`Retrieved items from ${url}`);
      items.push(...feedItems);
    }
    this.rss.sortItems(items).forEach((item: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    });
  },
});
