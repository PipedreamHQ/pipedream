import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-fulfillment",
  name: "Create Fulfillment",
  description:
    "Create a fulfillment for items in a fulfillment order."
    + " Use when items are ready to ship and you need to mark them as fulfilled."
    + " Use **Get Fulfillment Orders** to find the fulfillment order ID and its line item IDs."
    + " The `fulfillmentOrderLineItems` param is a JSON array with `id` (FulfillmentOrderLineItem GID) and `quantity`."
    + " Example: `[{\"id\": \"gid://shopify/FulfillmentOrderLineItem/123\", \"quantity\": 1}]`"
    + " Returns the fulfillment object including `id`, `status`, `trackingInfo`, and `fulfillmentLineItems`."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/fulfillmentcreate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Fulfillment actions require one of the following access scopes: `write_assigned_fulfillment_orders`, `write_merchant_managed_fulfillment_orders`, or `write_third_party_fulfillment_orders`. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/objects/fulfillmentorder#api-access-scopes)",
    },
    fulfillmentOrderId: {
      propDefinition: [
        shopify,
        "fulfillmentOrderId",
      ],
      description: "The GID of the fulfillment order to fulfill. Example: `gid://shopify/FulfillmentOrder/123456789`. Use **Get Fulfillment Orders** to find fulfillment order IDs and their line item IDs.",
    },
    fulfillmentOrderLineItems: {
      type: "string",
      label: "Fulfillment Order Line Items",
      description: "JSON array of line items to fulfill. Each must include `id` (FulfillmentOrderLineItem GID) and `quantity`. Example: `[{\"id\": \"gid://shopify/FulfillmentOrderLineItem/123\", \"quantity\": 1}]`",
    },
    notifyCustomer: {
      type: "boolean",
      label: "Notify Customer",
      description: "Whether to send a shipment notification to the customer",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "An optional message for the fulfillment",
      optional: true,
    },
  },
  async run({ $ }) {
    const lineItems = JSON.parse(this.fulfillmentOrderLineItems);
    const response = await this.shopify.createFulfillment({
      fulfillment: {
        lineItemsByFulfillmentOrder: [
          {
            fulfillmentOrderId: this.fulfillmentOrderId,
            fulfillmentOrderLineItems: lineItems,
          },
        ],
        notifyCustomer: this.notifyCustomer,
      },
      message: this.message,
    });
    if (response.fulfillmentCreate.userErrors.length > 0) {
      throw new Error(response.fulfillmentCreate.userErrors[0].message);
    }
    $.export("$summary", `Successfully created fulfillment \`${response.fulfillmentCreate.fulfillment.id}\``);
    return response.fulfillmentCreate.fulfillment;
  },
};
