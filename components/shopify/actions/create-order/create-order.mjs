import shopify from "../../shopify.app.js";

export default {
  key: "shopify-create-order",
  name: "Create Order",
  description: `Creates a new order
    More information at [Shopify Order Object](https://shopify.dev/api/admin-rest/2022-01/resources/order#resource_object)`,
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: `A list of line item objects, each containing information about an item in the order
        Full order properties at [Shopify Order API](https://shopify.dev/api/admin-rest/2022-01/resources/order#[post]/admin/api/#{api_version}/orders.json_examples)`,
    },
    customer: {
      propDefinition: [
        shopify,
        "customer",
      ],
      optional: true,
    },
    billingAddress: {
      type: "object",
      label: "Billing Address",
      description: "The mailing address associated with the payment method",
      optional: true,
      default: {},
    },
    shippingAddress: {
      type: "object",
      label: "Shipping Address",
      description: "The mailing address to where the order will be shipped",
      optional: true,
      default: {},
    },
    financialStatus: {
      type: "string",
      label: "Financial Status",
      description: `The status of payments associated with the order
        Can only be set when the order is created`,
      options: [
        "pending",
        "authorized",
        "partially_paid",
        "paid",
        "partially_refunded",
        "refunded",
        "voided",
      ],
      optional: true,
    },
    discountCodes: {
      type: "string[]",
      label: "Discount Codes",
      description: "A list of discounts applied to the order",
      optional: true,
    },
    fulfillments: {
      type: "string[]",
      label: "Fulfillments",
      description: `An array of fulfillments associated with the order
        For more information, see the [Fulfillment API](https://shopify.dev/api/admin-rest/2022-01/resources/fulfillment)`,
      optional: true,
    },
    fulfillmentStatus: {
      type: "string",
      label: "Fulfillment Status",
      description: "The order's status in terms of fulfilled line items",
      options: [
        "fulfilled",
        "null",
        "partial",
        "restocked",
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
      description: "An array of tax line objects, each of which details a tax applicable to the order",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The three-letter code ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) format) for the shop currency",
      optional: true,
    },
  },
  async run({ $ }) {
    let data = {
      line_items: this.shopify._parseArrayOfJSONStrings(this.lineItems),
      customer: this.customer,
      billing_address: this.billingAddress,
      shipping_address: this.shippingAddress,
      financial_status: this.financialStatus,
      discount_codes: this.shopify._parseArrayOfJSONStrings(this.discountCodes),
      fulfillments: this.shopify._parseArrayOfJSONStrings(this.fulfillments),
      fulfillment_status: this.fulfillmentStatus,
      send_receipt: this.sendReceipt,
      send_fulfillment_receipt: this.sendFulfillmentReceipt,
      tax_lines: this.shopify._parseArrayOfJSONStrings(this.taxLines),
      currency: this.currency,
    };

    let response = await this.shopify.createOrder(data);
    $.export("$summary", `Created new order with id \`${response.id}\``);
    return response;
  },
};
