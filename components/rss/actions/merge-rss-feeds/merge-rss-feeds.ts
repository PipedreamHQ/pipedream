import rss from "../../app/rss.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Merge RSS Feeds",
  description: "Retrieve multiple RSS feeds and return a merged array of items sorted by date [See docs](https://www.rssboard.org/rss-specification)",
  key: "rss-merge-rss-feeds",
  version: "1.0.1",
  type: "action",
  props: {
    rss,
    urls: {
      propDefinition: [
        rss,
        "urls",
      ],
    },
  },
  async run({ $ }) {
    const items = [];
    for (const url of this.urls) {
      const feedItems = await this.rss.fetchAndParseFeed(url);
      items.push(...feedItems);
    }
    $.export("$summary", "Successfully merged feeds!");
    return this.rss.sortItemsForActions(items);
  },
});
