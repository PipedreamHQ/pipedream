import app from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-get-invoice",
  name: "Get Invoice",
  description: "Find and retrieve a single invoice by its ID. [See the documentation](https://api.sevdesk.de/#tag/Invoice/operation/getInvoiceById)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    invoiceId: {
      propDefinition: [
        app,
        "invoiceId",
      ],
      description: "ID of the invoice to retrieve",
    },
  },
  async run({ $ }) {
    const {
      app,
      invoiceId,
    } = this;

    const response = await app.getInvoice({
      $,
      invoiceId,
    });

    $.export("$summary", `Successfully retrieved invoice with ID ${invoiceId}`);
    return response;
  },
};
