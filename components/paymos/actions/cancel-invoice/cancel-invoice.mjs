import paymos from "../../paymos.app.mjs";

export default {
  key: "paymos-cancel-invoice",
  name: "Cancel Invoice",
  description: "Cancel a Paymos invoice while it is still awaiting client selection. [See the documentation](https://paymos.io/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paymos,
    invoiceId: {
      propDefinition: [
        paymos,
        "invoiceId",
      ],
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Required cancellation reason stored on the invoice record (1 to 500 characters).",
    },
  },
  async run({ $ }) {
    const response = await this.paymos.cancelInvoice({
      invoiceId: this.invoiceId,
      reason: this.reason,
    });
    $.export("$summary", `Successfully cancelled invoice ${this.invoiceId}`);
    return response;
  },
};
