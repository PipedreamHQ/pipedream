// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-delete-invoice",
  name: "Delete Invoice",
  description: "Deletes an invoice from a Clockify workspace. This cannot be undone. Use **List Invoices** to find the ID of the invoice to delete. [See the documentation](https://docs.clockify.me/#tag/Invoice/operation/deleteInvoice)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    invoiceId: {
      propDefinition: [
        clockify,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    await this.clockify.deleteInvoice({
      $,
      workspaceId: this.workspaceId,
      invoiceId: this.invoiceId,
    });

    $.export("$summary", `Successfully deleted invoice with ID ${this.invoiceId}`);

    return {
      success: true,
    };
  },
};
