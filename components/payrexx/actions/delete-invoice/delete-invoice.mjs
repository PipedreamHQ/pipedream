import payrexx from "../../payrexx.app.mjs";

export default {
  key: "payrexx-delete-invoice",
  name: "Delete Invoice",
  description: "Delete an invoice. [See the documentation](https://payrexxserviceapi.readme.io/reference/delete-an-invoice)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    payrexx,
    invoiceId: {
      propDefinition: [
        payrexx,
        "invoiceId",
        (c) => ({
          merchantId: c.merchantId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.payrexx.deleteInvoice({
      $,
      invoiceId: this.invoiceId,
    });

    $.export("$summary", `Successfully deleted invoice with ID ${this.invoiceId}.`);
    return response;
  },
};
