import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-opportunity-estimated-value-updated",
  name: "Opportunity Estimated Value Updated",
  description: "Emit new event when the estimated value of an opportunity is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getEstimatedValues() {
      return this.db.get("estimatedValues") || {};
    },
    _setEstimatedValues(estimatedValues) {
      this.db.set("estimatedValues", estimatedValues);
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
      const estimatedValues = this._getEstimatedValues();
      const relevantResults = [];
      for (const result of results) {
        if (estimatedValues[result.opportunityid] !== result.estimatedvalue) {
          if (estimatedValues[result.opportunityid]) {
            relevantResults.push(result);
          }
          estimatedValues[result.opportunityid] = result.estimatedvalue;
        }
      }
      this._setEstimatedValues(estimatedValues);
      return relevantResults;
    },
    generateMeta(opportunity) {
      const ts = Date.parse(opportunity.modifiedon);
      return {
        id: `${opportunity.opportunityid}${ts}`,
        summary: `Opportunity Estimated Value Updated: ${opportunity.name}`,
        ts,
      };
    },
  },
};
