import shipday from "../../shipday.app.mjs";

export default {
  key: "shipday-create-order",
  name: "Create Shipping Order",
  description: "Creates a new shipping order. [See the documentation](https://docs.shipday.com/reference/insert-delivery-order)",
  version: "0.0.1",
  type: "action",
  props: {
    shipday,
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "Alphanumeric identifier for the order object",
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer",
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
      },
    });
    if (response?.orderId) {
      $.export("$summary", `Successfully created shipping order with ID: ${response.orderId}`);
    }
    return response;
  },
};
