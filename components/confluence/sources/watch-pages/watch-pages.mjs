import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "confluence-watch-pages",
  name: "Watch Pages",
  description: "Emit new event when a page is created or updated in Confluence",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.confluence.listPages;
    },
    async getArgs() {
      return {
        cloudId: await this.confluence.getCloudId(),
        params: {
          sort: "-modified-date",
        },
      };
    },
    getTs(post) {
      return Date.parse(post.version.createdAt);
    },
    getSummary(post) {
      return `New or updated page with ID ${post.id}`;
    },
  },
  sampleEmit,
};
