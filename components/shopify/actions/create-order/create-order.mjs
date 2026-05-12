import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-order",
  name: "Create Order",
  description:
    "Create a new order in Shopify programmatically."
    + " Use for B2B, manual order entry, or importing orders from external systems."
    + " Requires at least one line item with a `variantId` and `quantity`."
    + " Use **Search for Products** and **Search Product Variant** to find variant IDs."
    + " Returns the created order object including `id`, `name`, `lineItems`, and `financialStatus`."
    + " [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/ordercreate)",
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
      content: "Please verify that the Shopify shop has order data properly defined and that your API credentials have been granted the required access scopes. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    lineItems: {
      type: "string",
      label: "Line Items",
      description: "JSON array of line items. Each must include `variantId` and `quantity`. Example: `[{\"variantId\": \"gid://shopify/ProductVariant/12345\", \"quantity\": 2}]`",
    },
    customerId: {
      propDefinition: [
        shopify,
        "customerId",
      ],
      description: "The GID of the customer to associate with this order. Example: `gid://shopify/Customer/123456789`. Use **Search for Customers** to find customer IDs. Optional — omit to create a guest order.",
      optional: true,
    },
    billingAddress: {
      type: "string",
      label: "Billing Address",
      description: "JSON object for the billing address. Example: `{\"firstName\": \"Alan\", \"lastName\": \"Grant\", \"address1\": \"123 Main St\", \"city\": \"Malibu\", \"province\": \"CA\", \"country\": \"US\", \"zip\": \"90210\"}`",
      optional: true,
    },
    shippingAddress: {
      type: "string",
      label: "Shipping Address",
      description: "JSON object for the shipping address (same structure as Billing Address)",
      optional: true,
    },
    financialStatus: {
      type: "string",
      label: "Financial Status",
      description: "The payment status of the order",
      options: [
        "PENDING",
        "AUTHORIZED",
        "PARTIALLY_PAID",
        "PAID",
        "PARTIALLY_REFUNDED",
        "REFUNDED",
        "VOIDED",
      ],
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "An optional note to attach to the order",
      optional: true,
    },
    sendReceipt: {
      type: "boolean",
      label: "Send Receipt",
      description: "Whether to send an order confirmation email to the customer",
      optional: true,
    },
    inventoryBehavior: {
      type: "string",
      label: "Inventory Behavior",
      description: "How to handle inventory when creating the order",
      options: [
        {
          value: "BYPASS",
          label: "Do not claim inventory",
        },
        {
          value: "DECREMENT_IGNORING_POLICY",
          label: "Claim inventory, ignoring inventory policy",
        },
        {
          value: "DECREMENT_OBEYING_POLICY",
          label: "Claim inventory, following inventory policy",
        },
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const lineItems = JSON.parse(this.lineItems);
    const billingAddress = this.billingAddress
      ? JSON.parse(this.billingAddress)
      : undefined;
    const shippingAddress = this.shippingAddress
      ? JSON.parse(this.shippingAddress)
      : undefined;

    const response = await this.shopify.createOrder({
      order: {
        lineItems,
        billingAddress,
        shippingAddress,
        financialStatus: this.financialStatus,
        note: this.note,
        customer: this.customerId
          ? {
            toAssociate: {
              id: this.customerId,
            },
          }
          : undefined,
      },
      options: {
        sendReceipt: this.sendReceipt,
        inventoryBehaviour: this.inventoryBehavior,
      },
    });
    if (response.orderCreate.userErrors.length > 0) {
      throw new Error(response.orderCreate.userErrors[0].message);
    }
    $.export("$summary", `Successfully created order \`${response.orderCreate.order.name ?? response.orderCreate.order.id}\``);
    return response.orderCreate.order;
  },
};
