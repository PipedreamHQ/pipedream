import common from "../common/polling.mjs";

export default {
  ...common,
  key: "precisefp-new-account-created",
  name: "New Account Created",
  description: "Trigger when a new account is created. [See the documentation](https://documenter.getpostman.com/view/6125750/UyrDEFnd#5e5ebc43-65a3-4b07-9f44-70833a44de9d)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "items";
    },
    getResourceFn() {
      return this.app.listAccounts;
    },
    getResourceFnArgs() {
      return {
        params: {
          sort: "-created_at",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Account: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
