import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-line-item",
  name: "New Line Item",
  description: "Emit new event for each new line item added.",
  version: "0.0.12",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(lineItem) {
      return Date.parse(lineItem.createdAt);
    },
    generateMeta(lineItem) {
      const { id } = lineItem;
      const ts = this.getTs(lineItem);
      return {
        id,
        summary: `New Line Item ID: ${id}`,
        ts,
      };
    },
    isRelevant(lineItem, createdAfter) {
      return this.lineItem > createdAfter;
    },
    getParams() {
      return {
        limit: 100,
        sorts: [
          {
            propertyName: "createdate",
            direction: "DESCENDING",
          },
        ],
        object: "line_items",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
};
