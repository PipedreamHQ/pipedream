import constants from "../../common/constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "feedbin-new-search",
  name: "New Search",
  description: "Emit new event when a new search is created. [See the docs here](https://github.com/feedbin/feedbin-api/blob/master/content/saved-searches.md#get-saved-searches)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.feedbin.getSavedSearches;
    },
    getResourceFnArgs() {
      return {
        per_page: constants.DEFAULT_LIMIT,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.now(),
        summary: `Search ID ${resource.id}`,
      };
    },
  },
};
