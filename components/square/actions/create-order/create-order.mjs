import square from "../../square.app.mjs";

export default {
  key: "square-create-order",
  name: "Create Order",
  description: "Creates a new order that can include information about products for purchase. [See docs here](https://developer.squareup.com/reference/square/orders-api/create-order).",
  type: "action",
  version: "0.0.1",
  props: {
    square,
    location: {
      propDefinition: [
        square,
        "location",
      ],
    },
    customer: {
      propDefinition: [
        square,
        "customer",
      ],
      optional: true,
    },
    referenceId: {
      propDefinition: [
        square,
        "referenceId",
      ],
    },
    lineItems: {
      type: "object",
      label: "Line Items",
      description: "The line items included in the order. Please insert an array of `OrderLineItem`s as a custom expression. Must be a valid JSON. [See docs here](https://developer.squareup.com/reference/square/objects/OrderLineItem)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.square.createOrder({
      $,
      generateIdempotencyKey: true,
      data: {
        order: {
          location_id: this.location,
          customer_id: this.customer,
          reference_id: this.referenceId,
          line_items: typeof this.lineItems === "string"
            ? JSON.parse(this.lineItems)
            : this.lineItems,
        },
      },
    });
    $.export("$summary", "Successfully created order");
    return response;
  },
};
