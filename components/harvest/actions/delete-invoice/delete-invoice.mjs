import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-delete-invoice",
  name: "Delete Invoice",
  description: "Permanently delete an invoice. Use **List Invoices** to find a valid ID. Example: call with invoiceId set to a draft invoice's ID to remove it before it's sent. [See the documentation](https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/#delete-an-invoice).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    invoiceId: {
      propDefinition: [
        harvest,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    await this.harvest.deleteInvoice({
      $,
      invoiceId: this.invoiceId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully deleted invoice ${this.invoiceId}`);
  },
};
