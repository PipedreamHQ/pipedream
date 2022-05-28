import rss from "../../rss.app.mjs";
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
      description: "The list of RSS feeds you want to merge foo",
    },
    rss,
  },
  async run() {
    const parser = new Parser();
    const requests = this.feeds.map((feed: string) => parser.parseURL(feed));

    const results: any[] = await Promise.allSettled(requests);

    const items = results.map((res) => {
      const {
        status, value,
      } = res;
      if (status === "fulfilled") {
        const feed: Parser.Output<string> = value;
        return feed.items.map((item: object) => ({
          feed,
          item,
        }));
      }});

    return [
      ...items,
    ];
  },
});
