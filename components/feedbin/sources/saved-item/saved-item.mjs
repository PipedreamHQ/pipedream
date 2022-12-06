import constants from "../../common/constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "feedbin-saved-item",
  name: "New Saved Item",
  description: "Emit new event when a new item is saved. [See the docs here](https://github.com/feedbin/feedbin-api/blob/master/content/entries.md#get-v2entriesjson)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    feedId: {
      propDefinition: [
        common.props.feedbin,
        "feedId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.feedbin.getFeedEntries;
    },
    getResourceFnArgs() {
      const lastCreatedAt = this.getLastCreatedAt();
      return {
        feedId: this.feedId,
        params: {
          per_page: constants.DEFAULT_LIMIT,
          since: lastCreatedAt,
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
