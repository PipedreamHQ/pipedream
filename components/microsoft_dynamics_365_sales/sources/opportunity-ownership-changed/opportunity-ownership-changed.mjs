import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-opportunity-ownership-changed",
  name: "Opportunity Ownership Changed",
  description: "Emit new event when the ownership of an opportunity changes.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getOwnershipIds() {
      return this.db.get("ownershipIds") || {};
    },
    _setOwnershipIds(ownershipIds) {
      this.db.set("ownershipIds", ownershipIds);
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
      const ownershipIds = this._getOwnershipIds();
      const relevantResults = [];
      for (const result of results) {
        if (ownershipIds[result.opportunityid] !== result._ownerid_value) {
          if (ownershipIds[result.opportunityid]) {
            relevantResults.push(result);
          }
          ownershipIds[result.opportunityid] = result._ownerid_value;
        }
      }
      this._setOwnershipIds(ownershipIds);
      return relevantResults;
    },
    generateMeta(opportunity) {
      const ts = Date.parse(opportunity.modifiedon);
      return {
        id: `${opportunity.opportunityid}${ts}`,
        summary: `Opportunity Ownership Changed: ${opportunity.name}`,
        ts,
      };
    },
  },
};
