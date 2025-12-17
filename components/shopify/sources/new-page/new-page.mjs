import common from "../common/polling.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  ...common,
  key: "shopify-new-page",
  name: "New Page",
  type: "source",
  description: "Emit new event for each new page published.",
  version: "0.0.20",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResults() {
      const { pages: { nodes } } = await this.app.listPages({
        first: MAX_LIMIT,
        reverse: true,
      });
      return nodes;
    },
    getTsField() {
      return "createdAt";
    },
    generateMeta(page) {
      return {
        id: page.id,
        summary: `New Page: ${page.title}`,
        ts: Date.parse(page[this.getTsField()]),
      };
    },
  },
};
