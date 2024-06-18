import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-line-item-updated",
  name: "Line Item Updated",
  description: "Emit new event each time a line item is updated.",
  version: "0.0.14",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getTs(lineItem) {
      return Date.parse(lineItem.updatedAt);
    },
    generateMeta(lineItem) {
      const { id } = lineItem;
      const ts = this.getTs(lineItem);
      return {
        id: `${id}${ts}`,
        summary: `Line Item ID: ${id}`,
        ts,
      };
    },
    isRelevant(lineItem, updatedAfter) {
      return this.getTs(lineItem) > updatedAfter;
    },
    getParams() {
      return {
        data: {
          limit: 100,
          sorts: [
            {
              propertyName: "hs_lastmodifieddate",
              direction: "DESCENDING",
            },
          ],
        },
        object: "line_items",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
};
