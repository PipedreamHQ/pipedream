import base from "../common/base-polling.mjs";
import queries from "../../common/queries.mjs";

export default {
  ...base,
  key: "braintree-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    async getResults(lastCreatedAt) {
      const { braintree } = this;
      const response = await braintree.makeGraphQLRequest({
        data: {
          query: queries.searchCustomers,
          variables: {
            input: {
              createdAt: {
                greaterThanOrEqualTo: lastCreatedAt,
              },
            },
          },
        },
      });
      const edges = response?.data?.search?.customers?.edges ?? [];
      return edges.map((edge) => edge.node);
    },
    getSummary(result) {
      return `New Customer Created: ${result.id}`;
    },
  },
};
