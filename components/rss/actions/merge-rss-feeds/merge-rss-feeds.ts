import rss from "../../app/rss.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Merge RSS Feeds",
  description: "Retrieve multiple RSS feeds and return a merged array of items sorted by date",
  key: "rss-merge-rss-feeds",
  version: "1.0.0",
  type: "action",
  props: {
    feeds: {
      type: "string[]",
      label: "Feeds",
      description: "The list of RSS feeds you want to merge",
    },
    rss,
  },
  async run() {
    const items = [];
    for (const url of this.feeds) {
      const feedItems = await this.rss.fetchAndParseFeed(url);
      items.push(...feedItems);
    }
    return items;
  },
});
