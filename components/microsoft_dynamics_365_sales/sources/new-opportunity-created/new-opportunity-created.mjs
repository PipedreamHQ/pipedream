import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-new-opportunity-created",
  name: "New Opportunity Created",
  description: "Emit new event when a new opportunity is created.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.microsoftDynamics365Sales.listOpportunities;
    },
    getArgs() {
      return {
        params: {
          "$orderby": "createdon desc",
        },
      };
    },
    getTsField() {
      return "createdon";
    },
    generateMeta(opportunity) {
      return {
        id: opportunity.opportunityid,
        summary: `New Opportunity: ${opportunity.name}`,
        ts: Date.parse(opportunity.createdon),
      };
    },
  },
};
