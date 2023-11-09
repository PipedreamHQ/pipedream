import shipday from "../../shipday.app.mjs";

export default {
  key: "shipday-create-order",
  name: "Create Shipping Order",
  description: "Creates a new shipping order. [See the documentation](https://docs.shipday.com/reference/insert-delivery-order)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    shipday,
    expecteddeliverydate: {
      propDefinition: [
        shipday,
        "expecteddeliverydate",
      ],
    },
    expectedpickuptime: {
      propDefinition: [
        shipday,
        "expectedpickuptime",
      ],
    },
    expecteddeliverytime: {
      propDefinition: [
        shipday,
        "expecteddeliverytime",
      ],
    },
    pickuplatitude: {
      propDefinition: [
        shipday,
        "pickuplatitude",
      ],
    },
    pickuplongitude: {
      propDefinition: [
        shipday,
        "pickuplongitude",
      ],
    },
    deliverylatitude: {
      propDefinition: [
        shipday,
        "deliverylatitude",
      ],
    },
    deliverylongitude: {
      propDefinition: [
        shipday,
        "deliverylongitude",
      ],
    },
    tips: {
      propDefinition: [
        shipday,
        "tips",
      ],
    },
    tax: {
      propDefinition: [
        shipday,
        "tax",
      ],
    },
    discountamount: {
      propDefinition: [
        shipday,
        "discountamount",
      ],
    },
    deliveryfee: {
      propDefinition: [
        shipday,
        "deliveryfee",
      ],
    },
    totalordercost: {
      propDefinition: [
        shipday,
        "totalordercost",
      ],
    },
    pickupinstruction: {
      propDefinition: [
        shipday,
        "pickupinstruction",
      ],
    },
    deliveryinstruction: {
      propDefinition: [
        shipday,
        "deliveryinstruction",
      ],
    },
  },
  async run($) {
    const response = await this.shipday.createShippingOrder({
      expecteddeliverydate: this.expecteddeliverydate,
      expectedpickuptime: this.expectedpickuptime,
      expecteddeliverytime: this.expecteddeliverytime,
      pickuplatitude: this.pickuplatitude,
      pickuplongitude: this.pickuplongitude,
      deliverylatitude: this.deliverylatitude,
      deliverylongitude: this.deliverylongitude,
      tips: this.tips,
      tax: this.tax,
      discountamount: this.discountamount,
      deliveryfee: this.deliveryfee,
      totalordercost: this.totalordercost,
      pickupinstruction: this.pickupinstruction,
      deliveryinstruction: this.deliveryinstruction,
    });
    $.export("$summary", `Successfully created shipping order with ID: ${response.orderId}`);
    return response;
  },
};
