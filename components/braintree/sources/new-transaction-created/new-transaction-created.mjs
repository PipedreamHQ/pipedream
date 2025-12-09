import common from "../common/base-polling.mjs";
import queries from "../../common/queries.mjs";

export default {
  ...common,
  key: "braintree-new-transaction-created",
  name: "New Transaction Created",
  description: "Emit new event when a new transaction is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResults(lastCreatedAt) {
      const { braintree } = this;
      const { data: { search: { transactions: { edges } } } } = await braintree.makeGraphQLRequest({
        data: {
          query: queries.searchTransactions,
          variables: {
            input: {
              createdAt: {
                greaterThanOrEqualTo: lastCreatedAt,
              },
            },
          },
        },
      });
      return edges.map((edge) => edge.node);
    },
    getSummary(result) {
      return `New Transaction Created: ${result.id}`;
    },
  },
};
