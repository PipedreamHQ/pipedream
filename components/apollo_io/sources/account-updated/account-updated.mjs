import md5 from "md5";
import common from "../common/polling.mjs";

export default {
  ...common,
  key: "apollo_io-account-updated",
  name: "Account Updated",
  description: "Emit new event when an account is updated. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#search-for-contacts)",
  type: "source",
  version: "0.0.7",
  dedupe: "unique",
  props: {
    ...common.props,
    accountStageIds: {
      propDefinition: [
        common.props.app,
        "accountStageId",
      ],
      type: "string[]",
      label: "Account Stage IDs",
      description: "Array of stage IDs to filter accounts by",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    _getAccounts() {
      return this.db.get("accounts") || {};
    },
    _setAccounts(accounts) {
      this.db.set("accounts", accounts);
    },
    getResourceName() {
      return "accounts";
    },
    getResourceFn() {
      return this.app.searchAccounts;
    },
    getResourceFnArgs() {
      return {
        debug: true,
        params: {
          account_stage_ids: this.accountStageIds,
          sort_by_field: "account_last_activity_date",
          sort_ascending: false,
        },
      };
    },
    filterResources(resources) {
      const accounts = this._getAccounts();
      const updatedAccounts = [];
      for (const resource of resources) {
        const hash = md5(JSON.stringify(resource));
        if (accounts[resource.id] === hash) {
          continue;
        }
        updatedAccounts.push(resource);
        accounts[resource.id] = hash;
      }
      this._setAccounts(accounts);
      return updatedAccounts;
    },
    generateMeta(resource) {
      const ts = Date.now();
      return {
        id: `${resource.id}-${ts}`,
        summary: `Account Updated: ${resource.name}`,
        ts,
      };
    },
  },
};
