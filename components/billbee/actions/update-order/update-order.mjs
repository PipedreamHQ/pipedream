import app from "../../billbee.app.mjs";

export default {
  key: "billbee-update-order",
  name: "Update Order",
  description: "Partially update an existing order. [See the documentation](https://app.billbee.io//swagger/ui/index#/Orders/OrderApi_PatchOrder)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The order number",
      optional: true,
    },
    vatMode: {
      type: "integer",
      label: "VAT Mode",
      description: "VAT mode for the order",
      optional: true,
    },
    shippedAt: {
      type: "string",
      label: "Shipped At",
      description: "Order shipped date (ISO format). Eg. `2025-01-01T00:00:00.000Z`",
      optional: true,
    },
    payedAt: {
      type: "string",
      label: "Payed At",
      description: "Order payment date (ISO format). Eg. `2025-01-01T00:00:00.000Z`",
      optional: true,
    },
    sellerComment: {
      type: "string",
      label: "Seller Comment",
      description: "Comment from the seller",
      optional: true,
    },
    invoiceNumber: {
      type: "integer",
      label: "Invoice Number",
      description: "The invoice number",
      optional: true,
    },
    invoiceDate: {
      type: "string",
      label: "Invoice Date",
      description: "Invoice date (ISO format). Eg. `2025-01-01T00:00:00.000Z`",
      optional: true,
    },
    shippingCost: {
      type: "string",
      label: "Shipping Cost",
      description: "Shipping cost for the order",
      optional: true,
    },
    taxRate1: {
      type: "string",
      label: "Tax Rate 1",
      description: "First tax rate",
      optional: true,
    },
    taxRate2: {
      type: "string",
      label: "Tax Rate 2",
      description: "Second tax rate",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      orderId,
      orderNumber,
      vatMode,
      shippedAt,
      payedAt,
      sellerComment,
      invoiceNumber,
      invoiceDate,
      shippingCost,
      taxRate1,
      taxRate2,
    } = this;

    const response = await app.updateOrder({
      $,
      orderId,
      data: {
        OrderNumber: orderNumber,
        VatMode: vatMode,
        ShippedAt: shippedAt,
        PayedAt: payedAt,
        SellerComment: sellerComment,
        InvoiceNumber: invoiceNumber,
        InvoiceDate: invoiceDate,
        ...(shippingCost && {
          ShippingCost: parseFloat(shippingCost),
        }),
        ...(taxRate1 && {
          TaxRate1: parseFloat(taxRate1),
        }),
        ...(taxRate2 && {
          TaxRate2: parseFloat(taxRate2),
        }),
      },
    });

    $.export("$summary", `Successfully updated order \`${response.Data?.BillBeeOrderId}\``);

    return response;
  },
};
