import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";
import category from "../common/category.mjs";

export default {
  ...common,
  key: "inoreader-new-starred-article",
  name: "New Starred Article",
  description: "Emit new event when a new starred article is added. [See the Documentation](https://www.inoreader.com/developers/stream-contents)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "items";
    },
    getResourceFn() {
      return this.app.listStreamContents;
    },
    getResourceFnArgs() {
      return {
        feedId: category.STARRED,
        params: {
          n: constants.LIMIT_MAX,
          xt: category.READ,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Starred Article: ${resource.title}`,
        ts: Math.floor(+resource.timestampUsec / 1000),
      };
    },
  },
};
