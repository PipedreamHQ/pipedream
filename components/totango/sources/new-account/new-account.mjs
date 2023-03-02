import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Account",
  version: "0.0.3",
  key: "totango-new-account",
  description: "Emit new event for each created account. [See the docs](https://support.totango.com/hc/en-us/articles/204174135-Search-API-accounts-and-users-)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.name,
        summary: `New account with name ${data.name}`,
        ts: new Date(),
      });
    },
    getResourceMethod() {
      return this.totango.searchAccounts;
    },
  },
};
