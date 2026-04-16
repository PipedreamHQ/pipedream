import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-opportunity-stage-updated",
  name: "Opportunity Stage Updated",
  description: "Emit new event when the stage of an opportunity is updated.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getStages() {
      return this.db.get("stages") || {};
    },
    _setStages(stages) {
      this.db.set("stages", stages);
    },
    getResourceFn() {
      return this.microsoftDynamics365Sales.listOpportunities;
    },
    getArgs() {
      return {
        params: {
          "$orderby": "modifiedon desc",
        },
      };
    },
    getTsField() {
      return "modifiedon";
    },
    getRelevantResults(results) {
      const stages = this._getStages();
      const relevantResults = [];
      for (const result of results) {
        if (stages[result.opportunityid] !== result.stepname) {
          if (stages[result.opportunityid]) {
            relevantResults.push(result);
          }
          stages[result.opportunityid] = result.stepname;
        }
      }
      this._setStages(stages);
      return relevantResults;
    },
    generateMeta(opportunity) {
      const ts = Date.parse(opportunity.modifiedon);
      return {
        id: `${opportunity.opportunityid}${ts}`,
        summary: `Opportunity Stage Updated: ${opportunity.name}`,
        ts,
      };
    },
  },
};
