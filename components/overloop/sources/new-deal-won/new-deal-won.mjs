import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-deal-won",
  name: "New Deal Won",
  description: "Emit new event each time a deal is won. [See the docs](https://apidoc.overloop.com/#list-deals)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listDeals, {
        sort: "-updated_at",
        filter: "status:won",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(deal) {
      return Date.parse(deal.attributes.closed_at);
    },
    generateMeta(deal) {
      const ts = this.getResultTs(deal);
      return {
        id: `${deal.id}${ts}`,
        summary: deal.attributes.title,
        ts,
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listDeals, {
      sort: "-updated_at",
      filter: "status:won",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
