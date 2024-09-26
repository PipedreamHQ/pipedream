import common from "../common/base.mjs";

export default {
  ...common,
  key: "wubook_ratechecker-new-competitor-added",
  name: "New Competitor Added",
  description: "Emit new event when a new competitor is added. [See the docs](https://wubook.net/wrpeeker/ratechecker/api_examples)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources() {
      return this.wubook.getMonitoredCompetitors();
    },
    getIdField() {
      return "competitor_id";
    },
    generateMeta(competitor) {
      return {
        id: competitor.competitor_id,
        summary: competitor.name,
        ts: Date.now(),
      };
    },
  },
};
