import shopify from "../../shopify.app.mjs";

export default {
  name: "Send Graphql Request",
  version: "0.0.1",
  key: "send-graphql-request",
  description: "Send a GraphQL request to the Shopify Admin API.",
  props: {
    shopify,
    query: {
      label: "GraphQL Query",
      type: "string",
      description: "The Shopify Admin API GraphQL request",
    },
    variables: {
      label: "Variables",
      type: "object",
      description: "Variables passed to the query",
      optional: true,
    },
  },
  type: "action",
  async run() {
    const res = await this.shopify.getShopifyInstance().graphql(this.query, this.variables);
    return res;
  },
};
