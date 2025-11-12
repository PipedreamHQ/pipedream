import app from "../../dachser.app.mjs";

export default {
  name: "Get Delivery Order Status",
  description: "Retrieve the delivery order status using reference and customer details. [See the documentation](https://api-portal.dachser.com/bi.b2b.portal/api/library/deliveryorderstatus?6)",
  key: "dachser-get-delivery-order-status",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    info: {
      type: "alert",
      alertType: "info",
      content: "At least one shipment reference or an order date is necessary to get the status.",
    },
    referenceNumber1: {
      type: "string",
      label: "Reference Number 1",
      description: "Reference number 1.",
      optional: true,
    },
    referenceNumber2: {
      type: "string",
      label: "Reference Number 2",
      description: "Reference number 2.",
      optional: true,
    },
    referenceNumber3: {
      type: "string",
      label: "Reference Number 3",
      description: "Reference number 3.",
      optional: true,
    },
    purchaseOrderNumber: {
      type: "string",
      label: "Purchase Order Number",
      description: "Purchase order number.",
      optional: true,
    },
    deliveryOrderDate: {
      type: "string",
      label: "Delivery Order Date",
      description: "Delivery order date in `YYYY-MM-DD` format.",
      optional: true,
    },
    eventCode: {
      type: "string",
      label: "Event Code",
      description: "Event code.",
      optional: true,
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    acceptLanguage: {
      propDefinition: [
        app,
        "acceptLanguage",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      acceptLanguage,
      referenceNumber1,
      referenceNumber2,
      referenceNumber3,
      purchaseOrderNumber,
      deliveryOrderDate,
      eventCode,
      customerId,
    } = this;

    const response = await app.getDeliveryOrderStatus({
      $,
      params: {
        "reference-number1": referenceNumber1,
        "reference-number2": referenceNumber2,
        "reference-number3": referenceNumber3,
        "purchase-order-number": purchaseOrderNumber,
        "delivery-order-date": deliveryOrderDate,
        "event-code": eventCode,
        "customer-id": customerId,
      },
      headers: {
        "Accept-Language": acceptLanguage,
      },
    });

    $.export("$summary", `Successfully retrieved delivery order status for \`${response.deliveryOrders?.length ?? 0}\` delivery orders.`);

    return response;
  },
};

