import common from "../common/polling.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  ...common,
  key: "shopify-new-abandoned-cart",
  name: "New Abandoned Cart",
  description: "Emit new event each time a user abandons their cart.",
  version: "0.0.22",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResults() {
      const { abandonedCheckouts: { nodes } } = await this.app.listAbandonedCheckouts({
        first: MAX_LIMIT,
        reverse: true,
      });
      return nodes;
    },
    getTsField() {
      return "createdAt";
    },
    generateMeta(checkout) {
      return {
        id: checkout.id,
        summary: `New Abandoned Cart: ${checkout.id}`,
        ts: Date.parse(checkout[this.getTsField()]),
      };
    },
  },
};
