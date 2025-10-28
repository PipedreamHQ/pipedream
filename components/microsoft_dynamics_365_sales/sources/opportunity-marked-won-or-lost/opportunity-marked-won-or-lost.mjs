import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-opportunity-marked-won-or-lost",
  name: "Opportunity Marked Won or Lost",
  description: "Emit new event when an opportunity is marked as won or lost.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    stateCodes: {
      type: "integer[]",
      label: "State Codes",
      description: "State codes to emit events for",
      options: [
        {
          label: "Won",
          value: 1,
        },
        {
          label: "Lost",
          value: 2,
        },
      ],
      default: [
        1,
        2,
      ],
    },
  },
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
      if (!this.stateCodes.length) {
        return [];
      }
      const stateCodes = this._getStateCodes();
      const newStateCodes = stateCodes || {};
      const relevantResults = [];
      for (const result of results) {
        if (stateCodes
            && (stateCodes[result.opportunityid] !== result.statecode
              && this.stateCodes.includes(result.statecode)
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
        summary: `Opportunity Marked ${opportunity.statecode === 1
          ? "Won"
          : "Lost"}: ${opportunity.name}`,
        ts,
      };
    },
  },
};
