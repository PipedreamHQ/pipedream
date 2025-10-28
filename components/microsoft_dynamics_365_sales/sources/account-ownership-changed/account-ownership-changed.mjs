import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-account-ownership-changed",
  name: "Account Ownership Changed",
  description: "Emit new event when the ownership of an account changes.",
  version: "0.0.1",
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
      const ownershipIds = this._getOwnershipIds();
      const relevantResults = [];
      for (const result of results) {
        if (ownershipIds[result.accountid] !== result._ownerid_value) {
          if (ownershipIds[result.accountid]) {
            relevantResults.push(result);
          }
          ownershipIds[result.accountid] = result._ownerid_value;
        }
      }
      this._setOwnershipIds(ownershipIds);
      return relevantResults;
    },
    generateMeta(account) {
      const ts = Date.parse(account.modifiedon);
      return {
        id: `${account.accountid}${ts}`,
        summary: `Account Ownership Changed: ${account.name}`,
        ts,
      };
    },
  },
};
