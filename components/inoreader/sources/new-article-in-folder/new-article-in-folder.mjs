import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";
import category from "../common/category.mjs";

export default {
  ...common,
  key: "inoreader-new-article-in-folder",
  name: "New Article In Folder",
  description: "Emit new event when a new article is added to a folder. [See the Documentation](https://www.inoreader.com/developers/stream-contents)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    feedId: {
      propDefinition: [
        common.props.app,
        "tagName",
      ],
    },
  },
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
        feedId: this.feedId,
        params: {
          n: constants.LIMIT_MAX,
          xt: category.READ,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Article: ${resource.title}`,
        ts: Math.floor(+resource.timestampUsec / 1000),
      };
    },
  },
};
