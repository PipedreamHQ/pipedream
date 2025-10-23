import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-opportunity-close-probability-updated",
  name: "Opportunity Close Probability Updated",
  description: "Emit new event when the close probability of an opportunity is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getCloseProbabilities() {
      return this.db.get("closeProbabilities") || {};
    },
    _setCloseProbabilities(closeProbabilities) {
      this.db.set("closeProbabilities", closeProbabilities);
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
      const closeProbabilities = this._getCloseProbabilities();
      const relevantResults = [];
      for (const result of results) {
        if (closeProbabilities[result.opportunityid] !== result.closeprobability) {
          if (closeProbabilities[result.opportunityid]) {
            relevantResults.push(result);
          }
          closeProbabilities[result.opportunityid] = result.closeprobability;
        }
      }
      this._setCloseProbabilities(closeProbabilities);
      return relevantResults;
    },
    generateMeta(opportunity) {
      const ts = Date.parse(opportunity.modifiedon);
      return {
        id: `${opportunity.opportunityid}${ts}`,
        summary: `Opportunity Close Probability Updated: ${opportunity.name}`,
        ts,
      };
    },
  },
};
