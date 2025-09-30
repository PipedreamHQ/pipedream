import shipday from "../../shipday.app.mjs";

export default {
  key: "shipday-create-order",
  name: "Create Shipping Order",
  description: "Creates a new shipping order. [See the documentation](https://docs.shipday.com/reference/insert-delivery-order)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shipday,
    orderNumber: {
      propDefinition: [
        shipday,
        "orderNumber",
      ],
    },
    customerName: {
      propDefinition: [
        shipday,
        "customerName",
      ],
    },
    customerAddress: {
      propDefinition: [
        shipday,
        "customerAddress",
      ],
    },
    customerEmail: {
      propDefinition: [
        shipday,
        "customerEmail",
      ],
    },
    customerPhoneNumber: {
      propDefinition: [
        shipday,
        "customerPhoneNumber",
      ],
    },
    restaurantName: {
      propDefinition: [
        shipday,
        "restaurantName",
      ],
    },
    restaurantAddress: {
      propDefinition: [
        shipday,
        "restaurantAddress",
      ],
    },
    expectedDeliveryDate: {
      propDefinition: [
        shipday,
        "expectedDeliveryDate",
      ],
    },
    expectedPickupTime: {
      propDefinition: [
        shipday,
        "expectedPickupTime",
      ],
    },
    expectedDeliveryTime: {
      propDefinition: [
        shipday,
        "expectedDeliveryTime",
      ],
    },
    pickupLatitude: {
      propDefinition: [
        shipday,
        "pickupLatitude",
      ],
    },
    pickupLongitude: {
      propDefinition: [
        shipday,
        "pickupLongitude",
      ],
    },
    deliveryLatitude: {
      propDefinition: [
        shipday,
        "deliveryLatitude",
      ],
    },
    deliveryLongitude: {
      propDefinition: [
        shipday,
        "deliveryLongitude",
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
    discountAmount: {
      propDefinition: [
        shipday,
        "discountAmount",
      ],
    },
    deliveryFee: {
      propDefinition: [
        shipday,
        "deliveryFee",
      ],
    },
    totalOrderCost: {
      propDefinition: [
        shipday,
        "totalOrderCost",
      ],
    },
    pickupInstruction: {
      propDefinition: [
        shipday,
        "pickupInstruction",
      ],
    },
    deliveryInstruction: {
      propDefinition: [
        shipday,
        "deliveryInstruction",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shipday.createShippingOrder({
      data: {
        orderNumber: this.orderNumber,
        customerName: this.customerName,
        customerAddress: this.customerAddress,
        customerEmail: this.customerEmail,
        customerPhoneNumber: this.customerPhoneNumber,
        restaurantName: this.restaurantName,
        restaurantAddress: this.restaurantAddress,
        expectedDeliveryDate: this.expectedDeliveryDate,
        expectedPickupTime: this.expectedPickupTime,
        expectedDeliveryTime: this.expectedDeliveryTime,
        pickupLatitude: this.pickupLatitude,
        pickupLongitude: this.pickupLongitude,
        deliveryLatitude: this.deliveryLatitude,
        deliveryLongitude: this.deliveryLongitude,
        tips: this.tips,
        tax: this.tax,
        discountAmount: this.discountAmount,
        deliveryFee: this.deliveryFee,
        totalOrderCost: this.totalOrderCost,
        pickupInstruction: this.pickupInstruction,
        deliveryInstruction: this.deliveryInstruction,
      },
    });
    if (response?.orderId) {
      $.export("$summary", `Successfully created shipping order with ID: ${response.orderId}`);
    }
    return response;
  },
};
