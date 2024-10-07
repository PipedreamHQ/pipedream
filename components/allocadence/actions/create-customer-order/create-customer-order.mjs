import allocadence from "../../allocadence.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "allocadence-create-customer-order",
  name: "Create Customer Order",
  description: "Creates a new customer order. [See the documentation](https://docs.allocadence.com/)",
  version: "0.0.1",
  type: "action",
  props: {
    allocadence,
    customerInformation: {
      propDefinition: [
        allocadence,
        "customerInformation",
      ],
    },
    productDetails: {
      propDefinition: [
        allocadence,
        "productDetails",
      ],
    },
    shippingAddress: {
      propDefinition: [
        allocadence,
        "shippingAddress",
      ],
    },
    specialInstructions: {
      propDefinition: [
        allocadence,
        "specialInstructions",
        {
          optional: true,
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.allocadence.createCustomerOrder({
      customerInformation: this.customerInformation,
      productDetails: this.productDetails,
      shippingAddress: this.shippingAddress,
      specialInstructions: this.specialInstructions,
    });

    $.export("$summary", `Successfully created customer order with ID ${response.id}`);
    return response;
  },
};
