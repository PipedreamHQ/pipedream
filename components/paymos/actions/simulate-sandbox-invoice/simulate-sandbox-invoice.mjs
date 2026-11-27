import paymos, { PAYMOS_SANDBOX_STAGES } from "../../paymos.app.mjs";

export default {
  key: "paymos-simulate-sandbox-invoice",
  name: "Simulate Sandbox Invoice",
  description: "Simulate a payment outcome on a Sandbox Paymos invoice (`pk_test_` key required; rejected for `pk_live_` keys). [See the documentation](https://paymos.io/docs)",
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
    stage: {
      type: "string",
      label: "Stage",
      description: "Sandbox payment lifecycle stage to simulate (`paid`, `overpaid`, `underpay`, or `cancel`), e.g. `paid`.",
      options: [
        ...PAYMOS_SANDBOX_STAGES,
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paymos.simulateSandboxInvoice({
      $,
      invoiceId: this.invoiceId,
      stage: this.stage,
    });
    $.export("$summary", `Successfully simulated "${this.stage}" on sandbox invoice ${this.invoiceId}`);
    return response;
  },
};
