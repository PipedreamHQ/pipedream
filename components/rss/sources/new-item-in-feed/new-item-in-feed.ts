import rss from "../../app/rss.app";
import { defineSource } from "@pipedream/types";
import rssCommon from "../common/common";

export default defineSource({
  ...rssCommon,
  key: "rss-new-item-in-feed",
  name: "New Item in Feed",
  description: "Emit new items from an RSS feed",
  version: "1.1.1",
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
    publishedAfterThan: {
      type: "string",
      label: "Published After Than",
      description: "Emit items published after the specified date in ISO 8601 format .e.g `2022-12-07T12:57:10+07:00`",
      optional: true,
    },
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
    for (const item of this.rss.sortItems(items)) {
      if (this.publishedAfterThan) {
        const publishedAfterThan = +new Date(this.publishedAfterThan);
        const ts = this.rss.itemTs(item);
        if (Number.isNaN(publishedAfterThan) || publishedAfterThan > ts) {
          continue;
        }
      }
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
});
