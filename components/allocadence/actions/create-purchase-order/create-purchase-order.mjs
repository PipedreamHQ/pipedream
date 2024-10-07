import allocadence from "../../allocadence.app.mjs";

export default {
  key: "allocadence-create-purchase-order",
  name: "Create Purchase Order",
  description: "Generates a new purchase order. [See the documentation](https://docs.allocadence.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    allocadence,
    supplierDetails: {
      propDefinition: [
        allocadence,
        "supplierDetails",
      ],
    },
    productDetails: {
      propDefinition: [
        allocadence,
        "productDetails",
      ],
    },
    deliveryAddress: {
      propDefinition: [
        allocadence,
        "deliveryAddress",
      ],
    },
    orderDeadline: {
      propDefinition: [
        allocadence,
        "orderDeadline",
      ],
    },
    additionalInstructions: {
      propDefinition: [
        allocadence,
        "additionalInstructions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.allocadence.createPurchaseOrder({
      supplierDetails: this.supplierDetails,
      productDetails: this.productDetails,
      deliveryAddress: this.deliveryAddress,
      orderDeadline: this.orderDeadline,
      additionalInstructions: this.additionalInstructions,
    });

    $.export("$summary", `Successfully created purchase order with ID ${response.id}`);
    return response;
  },
};
