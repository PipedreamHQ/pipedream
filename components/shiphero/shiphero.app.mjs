import "graphql/language/index.js";
import { GraphQLClient } from "graphql-request";
import constants from "./common/constants.mjs";
import orderQueries from "./common/queries/order.mjs";

export default {
  type: "app",
  app: "shiphero",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order.",
      async options({ prevContext: { after } }) {
        if (after === null) {
          return [];
        }
        const {
          orders: {
            data: {
              edges, pageInfo: {
                hasNextPage, endCursor,
              },
            },
          },
        } =
          await this.listOrders({
            first: constants.DEFAULT_LIMIT,
            after,
            sort: "-order_date",
          });
        return {
          options: edges.map(({
            node: {
              id: value, order_number: label,
            },
          }) => ({
            label,
            value,
          })),
          context: {
            after: hasNextPage
              ? endCursor
              : null,
          },
        };
      },
    },
  },
  methods: {
    getConfig(conf) {
      return {
        ...conf,
        headers: {
          ...conf?.headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      };
    },
    getClient(conf) {
      return new GraphQLClient(
        `${constants.BASE_URL}${constants.VERSION_PATH}`,
        this.getConfig(conf),
      );
    },
    async makeRequest({
      headers, query, variables,
    } = {}) {
      const response = await this.getClient(headers).request(query, variables);
      if (response.errors?.length) {
        throw new Error(JSON.stringify(response, null, 2));
      }
      return response;
    },
    listOrders(variables = {}) {
      return this.makeRequest({
        query: orderQueries.listOrders,
        variables,
      });
    },
  },
};
