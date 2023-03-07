import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-exclusion-list-item-created",
  name: "New Exclusion List Item Created",
  description: "Emit new event each time an exclusion list item is created. [See the docs](https://apidoc.overloop.com/#list-exclusion-list-items)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listExclusingListItems, {
        sort: "-created_at",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(item) {
      return Date.parse(item.attributes.created_at);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: item.attributes.value,
        ts: this.getResultTs(item),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listExclusingListItems, {
      sort: "-created_at",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
