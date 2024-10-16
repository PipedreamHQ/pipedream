import teachNGo from "../../teach_n_go.app.mjs";

export default {
  key: "teach_n_go-invoice-mark-paid",
  name: "Mark Invoice as Paid",
  description: "Marks an existing invoice as paid within Teach 'n Go. [See the documentation](https://intercom.help/teach-n-go/en/articles/8727904-api-endpoints)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    teachNGo,
    invoiceId: {
      propDefinition: [
        teachNGo,
        "invoiceId",
      ],
    },
    paidDate: {
      propDefinition: [
        teachNGo,
        "paidDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.teachNGo.markInvoiceAsPaid({
      invoiceId: this.invoiceId,
      paidDate: this.paidDate,
    });

    $.export("$summary", `Successfully marked invoice ${this.invoiceId} as paid.`);
    return response;
  },
};
