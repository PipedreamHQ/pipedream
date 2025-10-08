import storeganise from "../../storeganise.app.mjs";

export default {
  key: "storeganise-mark-invoice-paid",
  name: "Mark Invoice as Paid",
  description: "Marks the selected invoice as paid in Storeganise. [See the documentation](https://pipedream-dev-trial.storeganise.com/api/docs/admin/invoices#admin_invoices.PUT_invoiceId)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    storeganise,
    invoiceId: {
      propDefinition: [
        storeganise,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.storeganise.updateInvoice({
      $,
      invoiceId: this.invoiceId,
      data: {
        state: "paid",
      },
    });
    $.export("$summary", `Invoice ${this.invoiceId} was marked as paid successfully`);
    return response;
  },
};
