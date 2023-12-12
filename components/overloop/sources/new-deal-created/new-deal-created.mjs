import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-deal-created",
  name: "New Deal Created",
  description: "Emit new event each time a deal is created. [See the docs](https://apidoc.overloop.com/#list-deals)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listDeals, {
        sort: "-created_at",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(deal) {
      return Date.parse(deal.attributes.created_at);
    },
    generateMeta(deal) {
      return {
        id: deal.id,
        summary: deal.attributes.title,
        ts: this.getResultTs(deal),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listDeals, {
      sort: "-created_at",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
