import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-new-account-created",
  name: "New Account Created",
  description: "Emit new event when a new account is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.microsoftDynamics365Sales.listAccounts;
    },
    getArgs() {
      return {
        params: {
          "$orderby": "createdon desc",
        },
      };
    },
    getTsField() {
      return "createdon";
    },
    generateMeta(account) {
      return {
        id: account.accountid,
        summary: `New Account: ${account.name}`,
        ts: Date.parse(account.createdon),
      };
    },
  },
};
