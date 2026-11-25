import paymos from "../../paymos.app.mjs";

export default {
  key: "paymos-get-invoice",
  name: "Get Invoice",
  description: "Retrieve a single Paymos invoice by its invoice ID. [See the documentation](https://paymos.io/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paymos,
    invoiceId: {
      propDefinition: [
        paymos,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paymos.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });
    $.export("$summary", `Successfully retrieved invoice ${this.invoiceId}`);
    return response;
  },
};
