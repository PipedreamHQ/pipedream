import paymos, { PAYMOS_REFUND_MODES } from "../../paymos.app.mjs";

export default {
  key: "paymos-create-refund",
  name: "Create Refund",
  description: "Create a server-calculated full or overpayment refund for an invoice back to the first saved sender. [See the documentation](https://paymos.io/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    paymos,
    invoiceId: {
      propDefinition: [
        paymos,
        "invoiceId",
      ],
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Server-calculated refund mode (`full` or `overpayment`), e.g. `full`. Paymos calculates amount, asset, network, and recipient server-side.",
      options: [
        ...PAYMOS_REFUND_MODES,
      ],
    },
    externalOrderId: {
      propDefinition: [
        paymos,
        "externalOrderId",
      ],
      description: "Your unique idempotency key for this refund request, e.g. `refund-1042-full`. Retries must reuse the same key with the same `invoiceId` and `mode` so Paymos returns the saved refund.",
    },
  },
  async run({ $ }) {
    const response = await this.paymos.createRefund({
      $,
      invoiceId: this.invoiceId,
      mode: this.mode,
      externalOrderId: this.externalOrderId,
    });
    $.export("$summary", `Successfully created ${this.mode} refund ${response?.withdrawal_id ?? this.externalOrderId} for invoice ${this.invoiceId}`);
    return response;
  },
};
