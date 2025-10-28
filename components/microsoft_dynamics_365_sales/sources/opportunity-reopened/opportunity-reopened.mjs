import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-opportunity-reopened",
  name: "Opportunity Reopened",
  description: "Emit new event when an opportunity is reopened.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getStateCodes() {
      return this.db.get("stateCodes");
    },
    _setStateCodes(stateCodes) {
      this.db.set("stateCodes", stateCodes);
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
      const stateCodes = this._getStateCodes();
      const newStateCodes = stateCodes || {};

      const relevantResults = [];
      for (const result of results) {
        if (stateCodes
          && (stateCodes[result.opportunityid] !== result.statecode
            && result.statecode === 0
          )
        ) {
          relevantResults.push(result);
        }
        newStateCodes[result.opportunityid] = result.statecode;
      }
      this._setStateCodes(newStateCodes);
      return relevantResults;
    },
    generateMeta(opportunity) {
      const ts = Date.parse(opportunity.modifiedon);
      return {
        id: `${opportunity.opportunityid}${ts}`,
        summary: `Opportunity Reopened: ${opportunity.name}`,
        ts,
      };
    },
  },
};
