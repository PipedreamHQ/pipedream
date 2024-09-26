import common from "../common/common.mjs";

export default {
  ...common,
  key: "wealthbox-new-opportunity-created",
  name: "New Opportunity Created",
  description: "Emit new event for each opportunity created. [See the documentation](http://dev.wealthbox.com/#opportunities-collection-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getEvents({ params }) {
      params = {
        ...params,
        order: "created",
      };
      const { opportunities } = await this.wealthbox.listOpportunities({
        params,
      });
      return opportunities;
    },
    generateMeta(opportunity) {
      return {
        id: opportunity.id,
        summary: `New Opportunity - ${opportunity.name}`,
        ts: this.getCreatedAtTs(opportunity),
      };
    },
  },
};
