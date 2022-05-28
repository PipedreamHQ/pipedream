import rss from "../../rss.app.js";
import Parser from "rss-parser";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Merge RSS Feeds",
  description: "Retrieve multiple RSS feeds and return a merged array of items sorted by date",
  key: "rss-merge-rss-feeds",
  version: "0.1.{{ts}}",
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
    const parser = new Parser();
    const requests = this.feeds.map((feed: string) => parser.parseURL(feed));

    const results = await Promise.all(requests);

    const items = results.map((feed: Parser.Output<string>) => feed.items.map((item: object) => ({
      feed,
      item,
    })));

    return items;
  },
});
