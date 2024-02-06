import { toSingleLineString } from "../common/common.mjs";

export default {
  props: {
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: toSingleLineString(`
        A list of line item objects, each containing information about an item in the order.
        Example: \`{ "variant_id": 447654529, "quantity": 1, "price": 2.50, "name": "Name", "title": "Title" }\`.
        More details when searching **line_items** in [Shopify Order Object](https://shopify.dev/api/admin-rest/2022-01/resources/order#resource_object)
      `),
    },
    billingAddress: {
      type: "object",
      label: "Billing Address",
      description: toSingleLineString(`
        The mailing address associated with the payment method.
        More details when searching **billing_address** in [Shopify Order Object](https://shopify.dev/api/admin-rest/2022-01/resources/order#resource_object)
      `),
      optional: true,
    },
    shippingAddress: {
      type: "object",
      label: "Shipping Address",
      description: toSingleLineString(`
        The mailing address to where the order will be shipped.
        More details when searching **billing_address** in [Shopify Order Object](https://shopify.dev/api/admin-rest/2022-01/resources/order#resource_object)
      `),
      optional: true,
    },
    financialStatus: {
      type: "string",
      label: "Financial Status",
      description: "The status of payments associated with the order. Can only be set when the order is created",
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
    discountCode: {
      type: "object",
      label: "Discount Code",
      description: toSingleLineString(`
        A discount applied to the order.
        Example: \`{ "code": "SPRING30", "type": "fixed_amount", "amount": "30.00" }\`.
        More details when searching **discount_codes** in [Shopify Order Object](https://shopify.dev/api/admin-rest/2022-01/resources/order#resource_object)
      `),
      optional: true,
    },
    fulfillments: {
      type: "string[]",
      label: "Fulfillments",
      description: "An array of fulfillments associated with the order. For more information, see the [Fulfillment API](https://shopify.dev/api/admin-rest/2022-01/resources/fulfillment)",
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
      description: toSingleLineString(`
        An array of tax line objects, each of which details a tax applicable to the order.
        Example: \`[ { "rate": 0.06, "price": 11.94, "title": "State Tax", "channel_liable": true } ]\`.
        More details when searching **tax_lines** in [Shopify Order Object](https://shopify.dev/api/admin-rest/2022-01/resources/order#resource_object)
      `),
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
    noteAttributes: {
      type: "string[]",
      label: "Note Attributes",
      description: "Extra information that is added to the order. Appears in the Additional details section of an order details page. Each array entry must contain an object with `name` and `value` keys.",
      optional: true,
    },
    inventoryBehavior: {
      type: "string",
      label: "Inventory Behavior",
      description: "The behaviour to use when updating inventory",
      options: [
        {
          value: "bypass",
          label: "Do not claim inventory",
        },
        {
          value: "decrement_ignoring_policy",
          label: "Ignore the product's inventory policy and claim inventory",
        },
        {
          value: "decrement_obeying_policy",
          label: "Follow the product's inventory policy and claim inventory, if possible",
        },
      ],
      optional: true,
    },
    shippingLines: {
      type: "string[]",
      label: "Shipping Lines",
      description: toSingleLineString(`
        An array of objects, each of which details a shipping method used.
        More details when searching **shipping_lines** in [Shopify Order Object](https://shopify.dev/api/admin-rest/2022-01/resources/order#resource_object)
      `),
      optional: true,
    },
  },
  async run({ $ }) {
    let data = {
      line_items: this.shopify.parseArrayOfJSONStrings(this.lineItems),
      billing_address: this.shopify.parseJSONStringObjects(this.billingAddress),
      shipping_address: this.shopify.parseJSONStringObjects(this.shippingAddress),
      financial_status: this.financialStatus,
      discount_codes: [
        this.shopify.parseJSONStringObjects(this.discountCode),
      ],
      fulfillments: this.shopify.parseArrayOfJSONStrings(this.fulfillments),
      fulfillment_status: this.fulfillmentStatus,
      send_receipt: this.sendReceipt,
      send_fulfillment_receipt: this.sendFulfillmentReceipt,
      tax_lines: this.shopify.parseArrayOfJSONStrings(this.taxLines),
      currency: this.currency,
      customer: {
        id: this.customerId,
      },
      note: this.note,
      note_attributes: this.shopify.parseArrayOfJSONStrings(this.noteAttributes),
      inventory_behaviour: this.inventoryBehavior,
      shipping_lines: this.shopify.parseArrayOfJSONStrings(this.shippingLines),
    };

    let response = (await this.shopify.createOrder(data)).result;
    $.export("$summary", `Created new order with id \`${response.id}\``);
    return response;
  },
};
