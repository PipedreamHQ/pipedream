import rssApp from "../../rss.app.mjs";

export default {
  key: "rss-new-item-from-multiple-feeds",
  name: "New item from multiple RSS feeds",
  type: "source",
  description: "Emit new items from multiple RSS feeds.",
  version: "0.0.1",
  props: {
    rssApp,
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
      const feed = await this.rssApp.fetchFeed(this, url);
      const items = await this.rssApp.parseFeed(feed);
      for (const item of items) {
        const itemKey = this.rssApp.itemKey(item);
        this.$emit(item, {
          id: itemKey,
          summary: item.title,
          ts: item.pubdate && +new Date(item.pubdate),
        });
      }
    }
  },
};
