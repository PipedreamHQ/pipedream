import feedbin from "../../feedbin.app.mjs";

export default {
  key: "feedbin-saved-item",
  name: "New Saved Item",
  description: "Emit new event when a new item is saved. [See the docs here](https://github.com/feedbin/feedbin-api/blob/master/content/entries.md#get-v2entriesjson)",
  type: "source",
  version: "0.0.1",
  props: {
    feedbin,
    feedId: {
      propDefinition: [
        feedbin,
        "feedId",
      ],
    },
  },
  async run({ $ }) {
    const { feedId } = this;
    const feedEntries = await this.feedbin.getFeedEntries({
      feedId,
    });

    $.export("$summary", "Succesfully got feed entries");

    const promises = feedEntries.map((entry) => {
      return this.$emit(entry, {
        id: entry.id,
        ts: Date.parse(entry.created_at),
        summary: `Saved Item with ID ${entry.id}`,
      });
    });

    await Promise.all(promises);
  },
};
