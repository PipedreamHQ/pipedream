import app from "../../netsuite.app.mjs";

export default {
  key: "netsuite-delete-invoice",
  name: "Delete Invoice",
  description: "Deletes an existing invoice. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag-invoice)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
    idempotentHint: true,
  },
  props: {
    app,
    invoiceId: {
      propDefinition: [
        app,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      invoiceId,
    } = this;

    const response = await app.deleteInvoice({
      $,
      invoiceId,
    });

    $.export("$summary", `Successfully deleted invoice with ID ${invoiceId}`);
    return response;
  },
};
