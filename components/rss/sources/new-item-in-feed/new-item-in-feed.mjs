import rssApp from "../../rss.app.mjs";

export default {
  key: "rss-new-item-in-feed",
  name: "New Item in Feed",
  type: "source",
  description: "Emit new items from an RSS feed.",
  version: "0.0.2",
  props: {
    rssApp,
    url: {
      type: "string",
      label: "Feed URL",
      description: "Enter the URL for any public RSS feed.",
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
    const feed = await this.rssApp.fetchFeed(this, this.url);
    const items = await this.rssApp.parseFeed(feed);
    for (const item of items) {
      const itemKey = this.rssApp.itemKey(item);
      this.$emit(item, {
        id: itemKey,
        summary: item.title,
        ts: item.pubdate && +new Date(item.pubdate),
      });
    }
  },
};
