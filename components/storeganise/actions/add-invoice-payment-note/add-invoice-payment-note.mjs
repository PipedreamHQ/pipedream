import storeganise from "../../storeganise.app.mjs";

export default {
  key: "storeganise-add-invoice-payment-note",
  name: "Add Invoice Payment Note",
  description: "Adds a note to the selected invoice payment. [See the documentation](https://pipedream-dev-trial.storeganise.com/api/docs/admin/invoices#admin_invoices._invoiceId_payments)",
  version: "0.0.1",
  type: "action",
  props: {
    storeganise,
    invoiceId: {
      propDefinition: [
        storeganise,
        "invoiceId",
      ],
    },
    itemId: {
      type: "string",
      label: "Invoice Payment ID",
      description: "The unique identifier of the invoice payment",
    },
    note: {
      propDefinition: [
        storeganise,
        "note",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.storeganise.updateInvoicePayment({
      $,
      invoiceId: this.invoiceId,
      itemId: this.itemId,
      data: {
        notes: this.note,
      },
    });
    $.export("$summary", `Successfully added note to invoice payment ${this.itemId}`);
    return response;
  },
};
