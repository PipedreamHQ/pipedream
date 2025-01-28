import printful from "../../printful.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "printful-create-order",
  name: "Create Order",
  description: "Creates a new order in your Printful account. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    printful: {
      type: "app",
      app: "printful",
    },
    recipientName: {
      propDefinition: [
        printful,
        "recipientName",
      ],
    },
    recipientAddress1: {
      propDefinition: [
        printful,
        "recipientAddress1",
      ],
    },
    recipientCity: {
      propDefinition: [
        printful,
        "recipientCity",
      ],
    },
    recipientState: {
      propDefinition: [
        printful,
        "recipientState",
      ],
    },
    recipientZip: {
      propDefinition: [
        printful,
        "recipientZip",
      ],
    },
    recipientCountry: {
      propDefinition: [
        printful,
        "recipientCountry",
      ],
    },
    shippingMethod: {
      propDefinition: [
        printful,
        "shippingMethod",
      ],
    },
    orderItems: {
      propDefinition: [
        printful,
        "orderItems",
      ],
    },
    recipientAddress2: {
      propDefinition: [
        printful,
        "recipientAddress2",
      ],
      optional: true,
    },
    orderNotes: {
      propDefinition: [
        printful,
        "orderNotes",
      ],
      optional: true,
    },
    orderMetadata: {
      propDefinition: [
        printful,
        "orderMetadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.printful.createOrder({
      recipientName: this.recipientName,
      recipientAddress1: this.recipientAddress1,
      recipientAddress2: this.recipientAddress2,
      recipientCity: this.recipientCity,
      recipientState: this.recipientState,
      recipientZip: this.recipientZip,
      recipientCountry: this.recipientCountry,
      shippingMethod: this.shippingMethod,
      orderItems: this.orderItems,
      orderNotes: this.orderNotes,
      orderMetadata: this.orderMetadata,
    });
    $.export("$summary", `Created order ${response.id}`);
    return response;
  },
};
