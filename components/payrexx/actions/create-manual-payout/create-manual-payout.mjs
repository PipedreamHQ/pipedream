import payrexx from "../../payrexx.app.mjs";

export default {
  key: "payrexx-create-manual-payout",
  name: "Create Manual Payout",
  description: "Create a manual payout. [See the documentation](https://developers.payrexx.com/reference/create-manual-payout)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    payrexx,
    amount: {
      propDefinition: [
        payrexx,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        payrexx,
        "currency",
      ],
    },
    pspId: {
      type: "string",
      label: "PSP ID",
      description: "ID of the PSP from which the payout is to be triggered. 44 for Swiss Collecting and 36 for Payrexx Direct",
    },
    statementDescriptor: {
      type: "string",
      label: "Statement Descriptor",
      description: "Statement of the payout. Visible in bank statement.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.payrexx.createManualPayout({
      $,
      data: {
        amount: this.amount,
        currency: this.currency,
        pspId: this.pspId,
        statementDescriptor: this.statementDescriptor,
      },
    });

    $.export("$summary", `Successfully created manual payout with ID: ${response.data[0]?.id}`);
    return response;
  },
};
