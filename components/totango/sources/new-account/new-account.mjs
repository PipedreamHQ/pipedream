import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Account",
  version: "0.0.1",
  key: "totango-new-account",
  description: "Emit new event for each created account",
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
