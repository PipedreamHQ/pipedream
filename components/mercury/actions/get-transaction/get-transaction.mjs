// x-pd-ai: optimized
import mercury from "../../mercury.app.mjs";

export default {
  key: "mercury-get-transaction",
  name: "Get Transaction",
  description: "Retrieve the full detail of a single Mercury transaction by its account and transaction IDs. Run **List Accounts** to obtain the account ID and **List Transactions** to obtain the transaction ID. Both IDs are UUIDs, not prefixed strings. Example: call with `accountId=\"69c8b0ee-8b87-11f1-a9e5-e7cd8f0e3f51\"` and `transactionId=\"9a3f2c14-4d21-11f1-8c7e-1b2d3e4f5a6b\"` -> returns the transaction `{ id, amount, counterpartyName, status, postedAt, ... }`. [See the documentation](https://docs.mercury.com/reference/gettransaction)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mercury,
    accountId: {
      propDefinition: [
        mercury,
        "account",
      ],
      label: "Account ID",
      description: "The account ID (UUID) the transaction belongs to. Run **List Accounts** to obtain a valid ID.",
    },
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "The transaction ID (UUID) to fetch. Run **List Transactions** to obtain a valid ID.",
    },
  },
  async run({ $ }) {
    const transaction = await this.mercury.getTransaction({
      $,
      accountId: this.accountId,
      transactionId: this.transactionId,
    });
    $.export("$summary", `Successfully retrieved transaction ${this.transactionId}`);
    return transaction;
  },
};
