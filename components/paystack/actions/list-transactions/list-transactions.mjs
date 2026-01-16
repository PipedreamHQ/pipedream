import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-list-transactions",
  name: "List Transactions",
  description: "List transactions carried out on your integration. [See the documentation](https://paystack.com/docs/api/transaction/#list)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    paystack,
    status: {
      propDefinition: [
        paystack,
        "status",
      ],
      optional: true,
    },
    customerID: {
      propDefinition: [
        paystack,
        "customerID",
      ],
      optional: true,
    },
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
    maxResults: {
      propDefinition: [
        paystack,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      status: this.status,
      customer: this.customerID,
      from: this.from,
      to: this.to,
    };
    const results = this.paystack.paginate({
      resourceFn: this.paystack.listTransactions,
      args: {
        $,
        params,
      },
      max: this.maxResults,
    });
    const transactions = [];
    for await (const item of results) {
      transactions.push(item);
    }

    $.export("$summary", `Successfully retrieved ${transactions.length} transaction${transactions.length === 1
      ? ""
      : "s"}`);
    return transactions;
  },
};
