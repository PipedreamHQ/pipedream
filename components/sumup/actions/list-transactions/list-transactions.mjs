import sumup from "../../sumup.app.mjs";

export default {
  key: "sumup-list-transactions",
  name: "List Transactions",
  description: "Lists detailed history of all transactions associated with the merchant profile. [See the documentation](https://developer.sumup.com/api/transactions/list-detailed)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sumup,
    transactionCode: {
      type: "string",
      label: "Transaction Code",
      description: "Transaction code returned by the acquirer/processing entity after processing the transaction",
      optional: true,
    },
    statuses: {
      propDefinition: [
        sumup,
        "statuses",
      ],
    },
    paymentTypes: {
      propDefinition: [
        sumup,
        "paymentTypes",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Earliest transaction date in ISO Format. Example: `2020-02-29T10:56:56.876Z`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Latest transaction date in ISO Format. Example: `2020-02-29T10:56:56.876Z`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of transactions to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const { items } = await this.sumup.listTransactions({
      $,
      params: {
        transaction_code: this.transactionCode,
        statuses: this.statuses,
        payment_types: this.paymentTypes,
        oldest_time: this.startDate,
        newest_time: this.endDate,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${items.length} transactions${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
