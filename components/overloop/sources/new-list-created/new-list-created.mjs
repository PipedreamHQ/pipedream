import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-list-created",
  name: "New List Created",
  description: "Emit new event each time a list is created. [See the docs](https://apidoc.overloop.com/#list-lists)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listLists, {
        sort: "-created_at",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(list) {
      return Date.parse(list.attributes.created_at);
    },
    generateMeta(list) {
      return {
        id: list.id,
        summary: list.attributes.name,
        ts: this.getResultTs(list),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listLists, {
      sort: "-created_at",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
