// x-pd-ai: optimized
import givebutter from "../../givebutter.app.mjs";

export default {
  key: "givebutter-get-transaction",
  name: "Get Transaction",
  description: "Retrieve a single transaction from Givebutter by its transaction ID. Returns the transaction object (includes `id`, `amount`, `fee`, `captured`, `refunded`, and `line_items`). [See the documentation](https://docs.givebutter.com/api-reference/transactions/get-a-transaction)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    givebutter,
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "The transaction ID (the Givebutter transaction `tid`, a string, e.g. `AbCd1234`). Obtain it from a transaction event or from your Givebutter dashboard; there is no list-transactions action in this set.",
    },
  },
  async run({ $ }) {
    const transaction = await this.givebutter.getTransaction({
      $,
      transactionId: this.transactionId,
    });
    $.export("$summary", `Retrieved transaction ${transaction?.id ?? this.transactionId}`);
    return transaction;
  },
};
