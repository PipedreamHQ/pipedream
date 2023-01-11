import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "recurly-new-account-created",
  name: "New Account Created",
  description: "Emit new event when a new account is created. [See the docs](https://recurly.com/developers/api/v2021-02-25/index.html#operation/list_accounts).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    listAccounts(args = {}) {
      return this.app.makeRequest({
        method: "listAccounts",
        ...args,
      });
    },
    getResourcesFn() {
      return this.listAccounts;
    },
    getResourcesFnArgs() {
      const lastCreatedAt = this.getLastCreatedAt();
      if (lastCreatedAt) {
        return {
          params: {
            limit: constants.DEFAULT_LIMIT,
            beginTime: lastCreatedAt,
          },
        };
      }
      return {
        params: {
          limit: constants.DEFAULT_LIMIT,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.createdAt),
        summary: `New Account ID ${resource.id}`,
      };
    },
  },
};
