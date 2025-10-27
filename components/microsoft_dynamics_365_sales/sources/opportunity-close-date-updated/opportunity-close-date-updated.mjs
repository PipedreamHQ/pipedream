import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-opportunity-close-date-updated",
  name: "Opportunity Close Date Updated",
  description: "Emit new event when the estimated close date of an opportunity is updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getCloseDates() {
      return this.db.get("closeDates") || {};
    },
    _setCloseDates(closeDates) {
      this.db.set("closeDates", closeDates);
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
      const closeDates = this._getCloseDates();
      const relevantResults = [];
      for (const result of results) {
        if (closeDates[result.opportunityid] !== result.estimatedclosedate) {
          if (closeDates[result.opportunityid]) {
            relevantResults.push(result);
          }
          closeDates[result.opportunityid] = result.estimatedclosedate;
        }
      }
      this._setCloseDates(closeDates);
      return relevantResults;
    },
    generateMeta(opportunity) {
      const ts = Date.parse(opportunity.modifiedon);
      return {
        id: `${opportunity.opportunityid}${ts}`,
        summary: `Opportunity Close Date Updated: ${opportunity.name}`,
        ts,
      };
    },
  },
};
