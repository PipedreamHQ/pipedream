import feedbin from "../../feedbin.app.mjs";

export default {
  key: "feedbin-saved-item",
  name: "New Saved Item",
  description: "Emit new event when a new item is saved. [See the docs here](https://github.com/feedbin/feedbin-api/blob/master/content/entries.md#get-v2entriesjson)",
  type: "source",
  version: "0.0.1",
  props: {
    feedbin,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Feedbin API",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    feedId: {
      propDefinition: [
        feedbin,
        "feedId",
      ],
    },
  },
  async run() {
    const { feedId } = this;

    const lastCreatedAt = this.db.get("lastCreatedAt");

    const feedEntries = await this.feedbin.getFeedEntries({
      feedId,
      params: {
        page: 1,
        per_page: 100,
        since: lastCreatedAt,
      },
    });

    const [
      lastEntry,
    ] = feedEntries;

    if (lastEntry) {
      this.db.set("lastCreatedAt", lastEntry.created_at);
    }

    feedEntries.forEach((entry) => {
      this.$emit(entry, {
        id: entry.id,
        ts: Date.parse(entry.created_at),
        summary: `Entry ID ${entry.id}`,
      });
    });
  },
};
