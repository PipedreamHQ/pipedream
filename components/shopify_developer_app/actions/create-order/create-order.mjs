import utils from "@pipedream/shopify/common/utils.mjs";
import shopify from "../../shopify_developer_app.app.mjs";

export default {
  key: "shopify_developer_app-create-order",
  name: "Create Order",
  description: "Creates a new order. For full order object details [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/ordercreate)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shopify,
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "A list of line item objects, each containing information about an item in the order. Example: `{ \"variantId\": \"gid://shopify/ProductVariant/44572675571992\", \"quantity\": 1, \"title\": \"Title\" }`. More details in [Shopify Order Object](https://shopify.dev/docs/api/admin-graphql/latest/objects/order)",
    },
    billingAddress: {
      type: "object",
      label: "Billing Address",
      description: "The mailing address associated with the payment method. More details when searching **billing_address** in [Shopify Order Object](https://shopify.dev/docs/api/admin-graphql/latest/objects/order)",
      optional: true,
    },
    shippingAddress: {
      type: "object",
      label: "Shipping Address",
      description: "The mailing address to where the order will be shipped. More details when searching **billing_address** in [Shopify Order Object](https://shopify.dev/docs/api/admin-graphql/latest/objects/order)",
      optional: true,
    },
    financialStatus: {
      type: "string",
      label: "Financial Status",
      description: "The status of payments associated with the order. Can only be set when the order is created",
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
    discountCode: {
      type: "object",
      label: "Discount Code",
      description: "A discount applied to the order. Example: `{ \"code\": \"SPRING30\", \"type\": \"fixed_amount\", \"amount\": \"30.00\" }`. More details when searching **discount_codes** in [Shopify Order Object](https://shopify.dev/docs/api/admin-graphql/latest/objects/order)",
      optional: true,
    },
    fulfillment: {
      type: "object",
      label: "Fulfillment",
      description: "Fulfillment associated with the order. For more information, see the [Fulfillment Object](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/OrderCreateFulfillmentInput)",
      optional: true,
    },
    fulfillmentStatus: {
      type: "string",
      label: "Fulfillment Status",
      description: "The order's status in terms of fulfilled line items",
      options: [
        "FULFILLED",
        "NULL",
        "PARTIAL",
        "RESTOCKED",
      ],
      optional: true,
    },
    sendReceipt: {
      type: "boolean",
      label: "Send Receipt",
      description: "Whether to send an order confirmation to the customer",
      optional: true,
    },
    sendFulfillmentReceipt: {
      type: "boolean",
      label: "Send Fulfillment Receipt",
      description: "Whether to send a shipping confirmation to the customer",
      optional: true,
    },
    taxLines: {
      type: "string[]",
      label: "Tax Lines",
      description: "An array of tax line objects, each of which details a tax applicable to the order. Example: `[ { \"rate\": 0.06, \"price\": 11.94, \"title\": \"State Tax\", \"channel_liable\": true } ]`. More details when searching **tax_lines** in [Shopify Order Object](https://shopify.dev/docs/api/admin-graphql/latest/objects/order)",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The three-letter code ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format) for the shop currency",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "An optional note that a shop owner can attach to the order",
      optional: true,
    },
    inventoryBehavior: {
      type: "string",
      label: "Inventory Behavior",
      description: "The behaviour to use when updating inventory",
      options: [
        {
          value: "BYPASS",
          label: "Do not claim inventory",
        },
        {
          value: "DECREMENT_IGNORING_POLICY",
          label: "Ignore the product's inventory policy and claim inventory",
        },
        {
          value: "DECREMENT_OBEYING_POLICY",
          label: "Follow the product's inventory policy and claim inventory, if possible",
        },
      ],
      optional: true,
    },
    shippingLines: {
      type: "string[]",
      label: "Shipping Lines",
      description: "An array of objects, each of which details a shipping method used. More details when searching **shipping_lines** in [Shopify Order Object](https://shopify.dev/docs/api/admin-graphql/latest/objects/order)",
      optional: true,
    },
    customerId: {
      propDefinition: [
        shopify,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shopify.createOrder({
      options: {
        sendReceipt: this.sendReceipt,
        sendFulfillmentReceipt: this.sendFulfillmentReceipt,
        inventoryBehaviour: this.inventoryBehavior,
      },
      order: {
        lineItems: utils.parseJson(this.lineItems),
        billingAddress: utils.parseJson(this.billingAddress),
        shippingAddress: utils.parseJson(this.shippingAddress),
        financialStatus: this.financialStatus,
        discountCode: utils.parseJson(this.discountCode),
        fulfillment: utils.parseJson(this.fulfillment),
        fulfillmentStatus: this.fulfillmentStatus,
        taxLines: utils.parseJson(this.taxLines),
        currency: this.currency,
        customer: {
          toAssociate: {
            id: this.customerId,
          },
        },
        note: this.note,
        shippingLines: utils.parseJson(this.shippingLines),
      },
    });
    if (response.orderCreate.userErrors.length > 0) {
      throw new Error(response.orderCreate.userErrors[0].message);
    }
    $.export("$summary", `Created new order with ID \`${response.orderCreate.order.id}\``);
    return response;
  },
};
