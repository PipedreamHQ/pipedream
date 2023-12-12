import common from "../common/base.mjs";

export default {
  ...common,
  key: "exact-new-account-created",
  name: "New Account Created",
  description: "Emit new event each time a new account is created. [See the docs](https://start.exactonline.nl/docs/HlpRestAPIResourcesDetails.aspx?name=CRMAccounts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResults(division) {
      return this.exact.listAccounts(division);
    },
    getCreatedTs(account) {
      return account.Created.match(/\d+/)[0];
    },
    generateMeta(account) {
      return {
        id: account.ID,
        summary: account.Name,
        ts: this.getCreatedTs(account),
      };
    },
  },
};
