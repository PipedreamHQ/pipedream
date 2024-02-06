import base from "../common/base.mjs";

export default {
  ...base,
  key: "outseta-new-account",
  name: "New Account Added",
  description: "Emit new event when an account is added. [See the documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k#7c31f27f-bbeb-40e4-1cf7-39de1ea59a8c)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    listingFn($) {
      return this.app.getAllAccounts({
        $,
        limit: 100,
        params: {
          orderBy: "Created+DESC",
        },
      });
    },
    getMeta(item) {
      return {
        id: item.Uid,
        summary: `New Account - ${item.Name}`,
        ts: new Date(item.Created),
      };
    },
  },
};
