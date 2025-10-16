import limoexpress from "../../limoexpress.app.mjs";

export default {
  key: "limoexpress-mark-invoice-paid",
  name: "Mark Invoice Paid",
  description: "Marks an invoice as paid. [See the documentation](https://api.limoexpress.me/api/docs/v1#/Invoices/markInvoiceAsPaid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    limoexpress,
    invoiceId: {
      propDefinition: [
        limoexpress,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.limoexpress.markInvoiceAsPaid({
      $,
      data: {
        invoice_id: this.invoiceId,
      },
    });

    $.export("$summary", `Successfully marked invoice with ID ${this.invoiceId} as paid`);
    return response;
  },
};
