import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-list-invoice-lines",
  name: "List Invoice Lines",
  description: "List all line items within an invoice. [See the documentation](https://developers.trolley.com/api/#get-invoice)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trolley,
    invoiceId: {
      propDefinition: [
        trolley,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    const { invoice } = await this.trolley.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });
    const lines = invoice?.lines ?? [];
    $.export("$summary", `Successfully retrieved ${lines.length} invoice line(s) for invoice ${this.invoiceId}`);
    return lines;
  },
};
