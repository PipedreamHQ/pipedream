import constants from "../../common/constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "feedbin-liked-item",
  name: "New Liked Item",
  description: "Emit new event when a new item is liked. [See the docs here](https://github.com/feedbin/feedbin-api/blob/master/content/starred-entries.md#get-starred-entries)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.feedbin.getEntries;
    },
    async getResourceFnArgs() {
      const starredEntryIds = await this.feedbin.getStarredEntries();
      return {
        params: {
          ids: `${starredEntryIds}`,
          per_page: constants.DEFAULT_LIMIT,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `Entry ID ${resource.id}`,
      };
    },
  },
};
