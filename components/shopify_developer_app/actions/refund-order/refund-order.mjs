import shopify from "../../shopify_developer_app.app.mjs";
import { MAX_LIMIT } from "@pipedream/shopify/common/constants.mjs";

export default {
  key: "shopify_developer_app-refund-order",
  name: "Refund Order",
  description: "Refund an order. [See the documentation](https://shopify.dev/docs/api/admin-graphql/unstable/mutations/refundcreate)",
  version: "0.0.2",
  type: "action",
  props: {
    shopify,
    orderId: {
      propDefinition: [
        shopify,
        "orderId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "An optional note that's attached to the refund",
      optional: true,
    },
    lineItemIds: {
      propDefinition: [
        shopify,
        "lineItemIds",
        (c) => ({
          orderId: c.orderId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.lineItemIds) {
      return props;
    }
    const order = await this.shopify.getOrder({
      id: this.orderId,
      first: MAX_LIMIT,
    });
    for (const id of this.lineItemIds) {
      const lineItem = order.order.lineItems.edges.find((item) => item.node.id === id);
      props[`quantity_${id}`] = {
        type: "integer",
        label: `Quantity for line item - ${lineItem.node.title}`,
        description: "The quantity of the line item to refund",
      };
      props[`restockType_${id}`] = {
        type: "string",
        label: `Restock type for line item - ${lineItem.node.title}`,
        description: "The restock type for the line item",
        options: [
          "CANCEL",
          "NO_RESTOCK",
          "RETURN",
        ],
        default: "RETURN",
      };
      props[`locationId_${id}`] = {
        type: "string",
        label: `Location ID for line item - ${lineItem.node.title}`,
        description: "The location ID for the line item",
        options: async ({ prevContext }) => {
          return this.shopify.getPropOptions({
            resourceFn: this.shopify.listLocations,
            resourceKeys: [
              "locations",
            ],
            labelKey: "name",
            prevContext,
          });
        },
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.shopify.refundOrder({
      input: {
        note: this.note,
        orderId: this.orderId,
        refundLineItems: this.lineItemIds.map((id) => ({
          lineItemId: id,
          quantity: this[`quantity_${id}`],
          locationId: this[`locationId_${id}`],
          restockType: this[`restockType_${id}`],
        })),
      },
    });

    if (response.refundCreate.userErrors.length > 0) {
      throw new Error(response.refundCreate.userErrors[0].message);
    }
    $.export("$summary", `Refunded order with ID: ${this.orderId}`);
    return response;
  },
};
