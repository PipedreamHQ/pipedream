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
  },
  async run({ $ }) {
    const starredEntryIds = await this.feedbin.getStarredEntries();

    const starredEntries = await this.feedbin.getEntries({
      params: {
        ids: starredEntryIds,
      },
    });

    $.export("$summary", "Succesfully got starred entries");

    const promises = starredEntries.map((entry) => {
      const timestamp = Date.now();
      return this.$emit(entry, {
        id: entry.id + timestamp,
        ts: timestamp,
        summary: `Starred Entry with ID ${entry.id}`,
      });
    });

    await Promise.all(promises);
  },
};
