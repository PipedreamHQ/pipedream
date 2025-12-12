import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-assigned-fulfillment-orders",
  name: "Get Assigned Fulfillment Orders",
  description: "Retrieve a list of fulfillment orders assigned to a merchant location. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/assignedfulfillmentorders)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has fulfillment services properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/admin-api/access-scopes)",
    },
    sortKey: {
      propDefinition: [
        shopify,
        "sortKey",
      ],
      description: "The key to sort the results by. Options: `ID`",
    },
    maxResults: {
      propDefinition: [
        shopify,
        "maxResults",
      ],
    },
    reverse: {
      propDefinition: [
        shopify,
        "reverse",
      ],
    },
  },
  async run({ $ }) {
    const fulfillmentOrders = await this.shopify.getPaginated({
      resourceFn: this.shopify.listAssignedFulfillmentOrders,
      resourceKeys: [
        "assignedFulfillmentOrders",
      ],
      variables: {
        sortKey: this.sortKey,
        reverse: this.reverse,
      },
      max: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${fulfillmentOrders.length} fulfillment order${fulfillmentOrders.length === 1
      ? ""
      : "s"}`);
    return fulfillmentOrders;
  },
};
