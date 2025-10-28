import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-account-status-changed",
  name: "Account Status Changed",
  description: "Emit new event when an account is activated or deactivated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getStatuses() {
      return this.db.get("statuses") || {};
    },
    _setStatuses(statuses) {
      this.db.set("statuses", statuses);
    },
    getResourceFn() {
      return this.microsoftDynamics365Sales.listAccounts;
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
      const statuses = this._getStatuses();
      const relevantResults = [];
      for (const result of results) {
        if (statuses[result.accountid] !== result.statuscode) {
          if (statuses[result.accountid]) {
            relevantResults.push(result);
          }
          statuses[result.accountid] = result.statuscode;
        }
      }
      this._setStatuses(statuses);
      return relevantResults;
    },
    generateMeta(account) {
      const ts = Date.parse(account.modifiedon);
      return {
        id: `${account.accountid}${ts}`,
        summary: `Account Status Changed: ${account.name}`,
        ts,
      };
    },
  },
};
