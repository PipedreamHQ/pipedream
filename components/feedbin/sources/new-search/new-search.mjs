import feedbin from "../../feedbin.app.mjs";

export default {
  key: "feedbin-new-search",
  name: "New Search",
  description: "Emit new event when a new search is created. [See the docs here](https://github.com/feedbin/feedbin-api/blob/master/content/saved-searches.md#get-saved-searches)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    feedbin,
  },
  async run({ $ }) {
    const savedSearches = await this.feedbin.getSavedSearches();

    $.export("$summary", "Succesfully got saved searches");

    const promises = savedSearches.map((search) => {
      const timestamp = Date.now();
      return this.$emit(search, {
        id: search.id + timestamp,
        ts: timestamp,
        summary: `Search with ID ${search.id}`,
      });
    });

    await Promise.all(promises);
  },
};
