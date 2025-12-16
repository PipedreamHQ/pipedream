import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-get-unmatched-bank-transactions",
  name: "Get Unmatched Bank Transactions",
  description: "Retrieves a list of unmatched bank transactions. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    bankAccountId: {
      propDefinition: [
        app,
        "bankAccountId",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getUnmatchedBankTransactions({
      bankAccountId: this.bankAccountId,
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} unmatched bank transactions`);
    return response;
  },
};
