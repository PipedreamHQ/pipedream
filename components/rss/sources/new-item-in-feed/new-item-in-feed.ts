import rss from "../../app/rss.app";
import { defineSource } from "@pipedream/types";
import rssCommon from "../common/common";

export default defineSource({
  ...rssCommon,
  key: "rss-new-item-in-feed",
  name: "New Item in Feed",
  description: "Emit new items from an RSS feed",
  version: "1.0.4",
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
    this.rss.sortItems(items).forEach((item: any) => {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    });
  },
});
