import wics from "../../wics.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "wics-update-order",
  name: "Update Order",
  description: "Update an order. [See the documentation](https://docs.wics.nl/test-environment.html#orders-update-order)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    wics,
    orderReference: {
      propDefinition: [
        wics,
        "orderReference",
      ],
    },
    deliveryDate: {
      type: "string",
      label: "Delivery Date",
      description: "The date that the order should be delivered. Format: YYYY-MM-DD",
      optional: true,
    },
    webshopId: {
      type: "integer",
      label: "Webshop ID",
      description: "The identifier that corresponds to the webshop account of Transmart or Paazl",
      optional: true,
    },
    warehouseCode: {
      type: "string",
      label: "Warehouse Code",
      description: "The warehouse used for this order",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note that will shown alongside the order",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "A shippingTag or tag that is linked with a shipment option in WICS.",
      optional: true,
    },
    pickupPoint: {
      type: "string",
      label: "Pickup Point",
      description: "A place for picking up the order",
      optional: true,
    },
    termsOfDelivery: {
      type: "string",
      label: "Terms of Delivery",
      description: "The delivery condition",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The order type of the order",
      optional: true,
    },
    invoiceAddressName: {
      type: "string",
      label: "Invoice Address Name",
      description: "The name of the invoice address",
      optional: true,
    },
    invoiceAddressStreetNumber: {
      type: "string",
      label: "Invoice Address Street Number",
      description: "The street number of the invoice address",
      optional: true,
    },
    invoiceAddressStreet: {
      type: "string",
      label: "Invoice Address Street Name",
      description: "The street name of the invoice address",
      optional: true,
    },
    invoiceAddressCity: {
      type: "string",
      label: "Invoice Address City",
      description: "The city of the invoice address",
      optional: true,
    },
    invoiceAddressState: {
      type: "string",
      label: "Invoice Address State",
      description: "The state of the invoice address",
      optional: true,
    },
    invoiceAddressZipcode: {
      type: "string",
      label: "Invoice Address Zipcode",
      description: "The zipcode of the invoice address",
      optional: true,
    },
    invoiceAddressCountry: {
      type: "string",
      label: "Invoice Address Country",
      description: "The country of the invoice address",
      optional: true,
    },
    invoiceEmail: {
      type: "string",
      label: "Invoice Email",
      description: "The email of the invoice address",
      optional: true,
    },
    deliveryAddressName: {
      type: "string",
      label: "Delivery Address Name",
      description: "The name of the delivery address",
      optional: true,
    },
    deliveryAddressStreetNumber: {
      type: "string",
      label: "Delivery Address Street Number",
      description: "The street number of the delivery address",
      optional: true,
    },
    deliveryAddressStreet: {
      type: "string",
      label: "Delivery Address Street Name",
      description: "The street name of the delivery address",
      optional: true,
    },
    deliveryAddressCity: {
      type: "string",
      label: "Delivery Address City",
      description: "The city of the delivery address",
      optional: true,
    },
    deliveryAddressState: {
      type: "string",
      label: "Delivery Address State",
      description: "The state of the delivery address",
      optional: true,
    },
    deliveryAddressZipcode: {
      type: "string",
      label: "Delivery Address Zipcode",
      description: "The zipcode of the delivery address",
      optional: true,
    },
    deliveryAddressCountry: {
      type: "string",
      label: "Delivery Address Country",
      description: "The country of the delivery address",
      optional: true,
    },
    deliveryEmail: {
      type: "string",
      label: "Delivery Email",
      description: "The email of the delivery address",
      optional: true,
    },
    lines: {
      type: "string[]",
      label: "Lines",
      description: "The lines of the order as an array of objects including the key `lineNumber`. Example: `[{ \"lineNumber\": 20002, \"itemCode\": \"16084\", \"itemDescription\": \"Speaker kabel\", \"quantity\": 5 }]` [See the documentation](https://docs.wics.nl/test-environment.html#orders-update-order) for additional information",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data: order } = await this.wics.getOrder({
      $,
      orderReference: this.orderReference,
    });

    // add in updated lines
    const lines = [];
    const newLines = parseObject(this.lines);
    for (const line of order.lines) {
      const newLine = newLines.find((l) => l.lineNumber === line.lineNumber);
      if (newLine) {
        lines.push(newLine);
      } else {
        lines.push(line);
      }
    }

    // add in new lines
    for (const line of newLines) {
      if (!lines.find((l) => l.lineNumber === line.lineNumber)) {
        lines.push(line);
      }
    }

    const { data } = await this.wics.updateOrder({
      $,
      orderReference: this.orderReference,
      data: {
        ...order,
        deliveryDate: this.deliveryDate,
        webshopId: this.webshopId,
        warehouseCode: this.warehouseCode,
        note: this.note,
        tag: this.tag,
        pickupPoint: this.pickupPoint,
        termsOfDelivery: this.termsOfDelivery,
        type: this.type,
        invoiceAddress: {
          ...order.invoiceAddress,
          name: this.invoiceAddressName,
          streetNumber: this.invoiceAddressStreetNumber,
          street: this.invoiceAddressStreet,
          city: this.invoiceAddressCity,
          state: this.invoiceAddressState,
          zipcode: this.invoiceAddressZipcode,
          country: this.invoiceAddressCountry,
          email: this.invoiceEmail,
        },
        deliveryAddress: {
          ...order.deliveryAddress,
          name: this.deliveryAddressName,
          streetNumber: this.deliveryAddressStreetNumber,
          street: this.deliveryAddressStreet,
          city: this.deliveryAddressCity,
          state: this.deliveryAddressState,
          zipcode: this.deliveryAddressZipcode,
          country: this.deliveryAddressCountry,
          email: this.deliveryEmail,
        },
        lines,
      },
    });
    $.export("$summary", `Successfully updated order ${this.orderReference}`);
    return data;
  },
};
