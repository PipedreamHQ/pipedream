import orderspace from "../../orderspace.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "orderspace-create-order",
  name: "Create Order",
  description: "Create a new order. [See the documentation](https://apidocs.orderspace.com/#create-an-order)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    orderspace,
    customerId: {
      propDefinition: [
        orderspace,
        "customerId",
      ],
    },
    shippingAddressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the shipping address",
    },
    shippingAddressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The second line of the shipping address",
      optional: true,
    },
    shippingCity: {
      type: "string",
      label: "City",
      description: "The city of the shipping address",
    },
    shippingState: {
      type: "string",
      label: "State",
      description: "The state of the shipping address",
    },
    shippingPostalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the shipping address",
    },
    shippingCountry: {
      type: "string",
      label: "Country",
      description: "The 2 letter country code of the shipping address",
    },
    billingAddressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the billing address",
    },
    billingAddressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The second line of the billing address",
      optional: true,
    },
    billingCity: {
      type: "string",
      label: "City",
      description: "The city of the billing address",
    },
    billingState: {
      type: "string",
      label: "State",
      description: "The state of the billing address",
    },
    billingPostalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the billing address",
    },
    billingCountry: {
      type: "string",
      label: "Country",
      description: "The 2 letter country code of the billing address",
    },
    orderLines: {
      type: "string[]",
      label: "Order Lines",
      description: "The lines of the order. [See the documentation](https://apidocs.orderspace.com/#create-an-order) for information about line format.",
    },
    deliveryDate: {
      type: "string",
      label: "Delivery Date",
      description: "The date the order is due (YYYY-MM-DD)",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "The reference for the order",
      optional: true,
    },
    internalNote: {
      type: "string",
      label: "Internal Note",
      description: "An internal note for the order",
      optional: true,
    },
    customerPoNumber: {
      type: "string",
      label: "Customer PO Number",
      description: "The customer's purchase order number for this order",
      optional: true,
    },
    customerNote: {
      type: "string",
      label: "Customer Note",
      description: "The customer's note on this order",
      optional: true,
    },
  },
  async run({ $ }) {
    const { order } = await this.orderspace.createOrder({
      $,
      data: {
        order: {
          customer_id: this.customerId,
          delivery_date: this.deliveryDate,
          reference: this.reference,
          internal_note: this.internalNote,
          customer_po_number: this.customerPoNumber,
          customer_note: this.customerNote,
          shipping_address: {
            line1: this.shippingAddressLine1,
            line2: this.shippingAddressLine2,
            city: this.shippingCity,
            state: this.shippingState,
            postal_code: this.shippingPostalCode,
            country: this.shippingCountry,
          },
          billing_address: {
            line1: this.billingAddressLine1,
            line2: this.billingAddressLine2,
            city: this.billingCity,
            state: this.billingState,
            postal_code: this.billingPostalCode,
            country: this.billingCountry,
          },
          order_lines: parseObject(this.orderLines),
        },
      },
    });
    $.export("$summary", `Successfully created order ${order.id}`);
    return order;
  },
};
