import app from "../../billbee.app.mjs";

export default {
  key: "billbee-create-invoice-for-order",
  name: "Create Invoice For Order",
  description: "Create an invoice for an existing order. [See the documentation](https://app.billbee.io//swagger/ui/index#/Orders/OrderApi_CreateInvoice)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the invoice template to use",
      optional: true,
    },
    includeInvoicePdf: {
      type: "boolean",
      label: "Include Invoice PDF",
      description: "If true, the PDF is included in the response as base64 encoded string",
      optional: true,
    },
    sendToCloudId: {
      label: "Send To Cloud ID",
      propDefinition: [
        app,
        "cloudStorageId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      orderId,
      templateId,
      includeInvoicePdf,
      sendToCloudId,
    } = this;

    await app.createInvoiceForOrder({
      $,
      orderId,
      data: {
        TemplateId: templateId,
        IncludeInvoicePdf: includeInvoicePdf,
        SendToCloudId: sendToCloudId,
      },
    });

    $.export("$summary", `Successfully created invoice for order \`${orderId}\``);

    return {
      success: true,
    };
  },
};
