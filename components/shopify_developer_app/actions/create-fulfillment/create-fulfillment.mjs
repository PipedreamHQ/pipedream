import shopify from "../../shopify_developer_app.app.mjs";

export default {
  key: "shopify_developer_app-create-fulfillment",
  name: "Create Fulfillment",
  description: "Create a fulfillment. [See the documentation](https://shopify.dev/docs/api/admin-graphql/unstable/mutations/fulfillmentcreate)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    fulfillmentOrderId: {
      propDefinition: [
        shopify,
        "fulfillmentOrderId",
      ],
    },
    fulfillmentOrderLineItemIds: {
      propDefinition: [
        shopify,
        "fulfillmentOrderLineItemIds",
        (c) => ({
          fulfillmentOrderId: c.fulfillmentOrderId,
        }),
      ],
      reloadProps: true,
    },
    notifyCustomer: {
      type: "boolean",
      label: "Notify Customer",
      description: "Whether to notify the customer",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "An optional message for the fulfillment request.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.fulfillmentOrderLineItemIds) {
      return props;
    }

    for (const id of this.fulfillmentOrderLineItemIds) {
      props[`quantity_${id}`] = {
        type: "integer",
        label: `Quantity for Line Item - ${id}`,
        description: "The quantity of the line item to fulfill",
      };
    }
    return props;
  },
  async run({ $ }) {
    const fulfillment = await this.shopify.createFulfillment({
      fulfillment: {
        lineItemsByFulfillmentOrder: [
          {
            fulfillmentOrderId: this.fulfillmentOrderId,
            fulfillmentOrderLineItems: this.fulfillmentOrderLineItemIds.map((id) => ({
              id,
              quantity: this[`quantity_${id}`],
            })),
          },
        ],
        notifyCustomer: this.notifyCustomer,
      },
      message: this.message,
    });
    if (fulfillment.fulfillmentCreate.userErrors.length > 0) {
      throw new Error(fulfillment.fulfillmentCreate.userErrors[0].message);
    }
    $.export("$summary", `Created fulfillment with ID: ${fulfillment.fulfillmentCreate.fulfillment.id}`);
    return fulfillment;
  },
};
