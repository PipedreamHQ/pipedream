import common from "../common/polling.mjs";

export default {
  ...common,
  key: "apollo_io-account-created",
  name: "New Account Created",
  description: "Emit new event when an account is created. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#search-for-accounts)",
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
          sort_by_field: "account_created_at",
          sort_ascending: false,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Account: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
