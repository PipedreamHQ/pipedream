import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-opportunity-contact-changed",
  name: "Opportunity Contact Changed",
  description: "Emit new event when an opportunity's contact is changed.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getContactIds() {
      return this.db.get("contactIds") || {};
    },
    _setContactIds(contactIds) {
      this.db.set("contactIds", contactIds);
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
      const contactIds = this._getContactIds();
      const relevantResults = [];
      for (const result of results) {
        if (contactIds[result.opportunityid] !== result._parentcontactid_value) {
          if (contactIds[result.opportunityid]) {
            relevantResults.push(result);
          }
          contactIds[result.opportunityid] = result._parentcontactid_value;
        }
      }
      this._setContactIds(contactIds);
      return relevantResults;
    },
    generateMeta(opportunity) {
      const ts = Date.parse(opportunity.modifiedon);
      return {
        id: `${opportunity.opportunityid}${ts}`,
        summary: `Opportunity Contact Changed: ${opportunity.name}`,
        ts,
      };
    },
  },
};
