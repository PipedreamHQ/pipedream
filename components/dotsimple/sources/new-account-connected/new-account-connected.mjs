import common from "../common/polling.mjs";

export default {
  ...common,
  key: "dotsimple-new-account-connected",
  name: "New Account Connected",
  description: "Emit new event when a new account is connected. [See the documentation](https://help.dotsimple.io/en/articles/65-accounts).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listAccounts;
    },
    generateMeta(resource) {
      return {
        id: resource.uuid,
        summary: `New Account: ${resource.uuid}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
