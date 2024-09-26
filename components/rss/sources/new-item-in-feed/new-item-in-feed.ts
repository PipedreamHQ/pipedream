import { defineSource } from "@pipedream/types";
import rss from "../../app/rss.app";
import rssCommon from "../common/common";

export default defineSource({
  ...rssCommon,
  key: "rss-new-item-in-feed",
  name: "New Item in Feed",
  description: "Emit new items from an RSS feed",
  version: "1.2.7",
  type: "source",
  dedupe: "unique",
  props: {
    ...rssCommon.props,
    url: {
      propDefinition: [
        rss,
        "url",
      ],
    },
    publishedAfter: {
      type: "string",
      label: "Published After",
      description: "Emit items published after the specified date in ISO 8601 format .e.g `2022-12-07T12:57:10+07:00`",
      default: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // default to one day ago
    },
  },
  hooks: {
    async activate() {
      // Try to parse the feed one time to confirm we can fetch and parse.
      // The code will throw any errors to the user.
      await this.rss.fetchAndParseFeed(this.url);
    },
  },
  methods: {
    ...rssCommon.methods,
    generateMeta: function (item) {
      return {
        id: this.rss.itemKey(item),
        summary: item.title,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const items = await this.rss.fetchAndParseFeed(this.url);
    for (const item of items.reverse()) {
      const publishedAfter = +new Date(this.publishedAfter);
      const ts = this.rss.itemTs(item);
      if (Number.isNaN(publishedAfter) || publishedAfter > ts) {
        continue;
      }
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
});
