import shopify from "../../shopify.app.mjs";

export default {
  name: "Send REST Request",
  version: "0.0.1",
  key: "send-rest-request",
  description: "Send a Shopify Admin API REST request.",
  props: {
    shopify,
    uri: {
      type: "string",
      label: "URI",
      description: "The path to query. For example `/orders.json` to query Shopify orders",
    },
    method: {
      type: "string",
      label: "HTTP Method",
      description: "The HTTP method to make the request with.",
    },
    body: {
      type: "object",
      label: "Request body",
      description: "The body of payload, this will be converted to JSON automatically.",
      optional: true,
    },
  },
  type: "action",
  async run() {
    return await this.shopify.getShopifyInstance().request(`${this.shopify._getBaseURL()}${this.uri}`, this.method, false, this.body);
  },
};
