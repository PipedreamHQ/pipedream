import app from "../../shiphero.app.mjs";
import orderMutations from "../../common/mutations/order.mjs";

export default {
  key: "shiphero-update-order",
  name: "Update Order",
  description: "Update an order. [See the documentation](https://developer.shiphero.com/getting-started/)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The order number.",
      optional: true,
    },
    partnerOrderId: {
      type: "string",
      label: "Partner Order ID",
      description: "The partner order ID.",
      optional: true,
    },
    fulfillmentStatus: {
      type: "string",
      label: "Fulfillment Status",
      description: "The fulfillment status.",
      optional: true,
    },
    orderDate: {
      type: "string",
      label: "Order Date",
      description: "The order date. A DateTime field type that understand **ISO 8601** strings, besides datetime objects. It supports strings with and without times, as well as using `T` or space as delimiter\nEg.\n- `YYYY-mm-dd`\n- `YYYY-mm-dd HH:MM:SS`\n - `YYYY-mm-ddTHH:MM:SS`",
      optional: true,
    },
    totalTax: {
      type: "string",
      label: "Total Tax",
      description: "The total tax for the order.",
      optional: true,
    },
    subtotal: {
      type: "string",
      label: "Subtotal",
      description: "The subtotal for the order.",
      optional: true,
    },
    totalDiscounts: {
      type: "string",
      label: "Total Discounts",
      description: "The total discounts for the order.",
      optional: true,
    },
    totalPrice: {
      type: "string",
      label: "Total Price",
      description: "The total price for the order.",
      optional: true,
    },
    customInvoiceUrl: {
      type: "string",
      label: "Custom Invoice URL",
      description: "The custom invoice URL for the order.",
      optional: true,
    },
    profile: {
      type: "string",
      label: "Profile",
      description: "The profile for the order.",
      optional: true,
    },
    packingNote: {
      type: "string",
      label: "Packing Note",
      description: "The packing note for the order.",
      optional: true,
    },
    requiredShipDate: {
      type: "string",
      label: "Required Ship Date",
      description: "The required ship date for the order. A DateTime field type that understand **ISO 8601** strings, besides datetime objects. It supports strings with and without times, as well as using `T` or space as delimiter\nEg.\n- `YYYY-mm-dd`\n- `YYYY-mm-dd HH:MM:SS`\n - `YYYY-mm-ddTHH:MM:SS`",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags for the order.",
      optional: true,
    },
    priorityFlag: {
      type: "boolean",
      label: "Priority Flag",
      description: "The priority flag for the order.",
      optional: true,
    },
    giftNote: {
      type: "string",
      label: "Gift Note",
      description: "The gift note for the order.",
      optional: true,
    },
  },
  methods: {
    updateOrder(variables = {}) {
      return this.app.makeRequest({
        query: orderMutations.updateOrder,
        variables,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      updateOrder,
      ...variables
    } = this;

    const response = await updateOrder(variables);

    step.export("$summary", `Successfully updated order with request ID \`${response.order_update.request_id}\`.`);

    return response;
  },
};
