import rss from "@pipedream/rss";
import { defineSource } from "@pipedream/types";

export default defineSource({
  key: "rss-new-item-from-multiple-feeds",
  name: "New item from multiple RSS feeds",
  type: "source",
  description: "Emit new items from multiple RSS feeds.",
  version: "1.0.0",
  props: {
    rss,
    urls: {
      type: "string[]",
      label: "Feed URLs",
      description: "Enter either one or multiple URLs from any public RSS feed.\n\n**Example:** `[\"https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml\", \"https://www.theguardian.com/uk/technology/rss\"]`",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  dedupe: "unique",
  async run() {
    for (const url of this.urls) {
      const items = await this.rss.fetchAndParseFeed(url);
      items.forEach((item: any) => {
        this.$emit(item, {
          id: this.rss.itemKey(item),
          summary: item.title,
          ts: item.pubdate && +new Date(item.pubdate),
        });
      });
    }
  },
});
