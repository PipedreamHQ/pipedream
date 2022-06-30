import feedbin from "../../feedbin.app.mjs";

export default {
  key: "feedbin-liked-item",
  name: "New Liked Item",
  description: "Emit new event when a new item is liked. [See the docs here](https://github.com/feedbin/feedbin-api/blob/master/content/starred-entries.md#get-starred-entries)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
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
  },
  async run() {
    const starredEntryIds = await this.feedbin.getStarredEntries();

    const starredEntries = await this.feedbin.getEntries({
      params: {
        ids: `${starredEntryIds}`,
        page: 1,
        per_page: 100,
      },
    });

    starredEntries.forEach((entry) => {
      this.$emit(entry, {
        id: entry.id,
        ts: Date.parse(entry.created_at),
        summary: `Entry ID ${entry.id}`,
      });
    });
  },
};
