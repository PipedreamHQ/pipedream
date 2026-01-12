import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-export-transactions",
  name: "Export Transactions",
  description: "Export transactions from Paystack. See the documentation (https://paystack.com/docs/api/transaction/#export)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paystack,
    from: {
      propDefinition: [
        paystack,
        "from",
      ],
      optional: true,
    },
    to: {
      propDefinition: [
        paystack,
        "to",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        paystack,
        "status",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      from: this.from,
      to: this.to,
      status: this.status,
    };

    const response = await this.paystack.exportTransactions({
      $,
      params,
    });

    $.export("$summary", "Successfully requested transaction export");
    return response;
  },
};
