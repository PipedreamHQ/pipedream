import poof from "../../poof.app.mjs";

export default {
  key: "poof-list-transactions",
  name: "List Transactions",
  description: "Retrieve a list of transactions in Poof. [See the documentation](https://docs.poof.io/reference/fetch-transaction-list)",
  version: "0.0.1",
  type: "action",
  props: {
    poof,
  },
  async run({ $ }) {
    const response = await this.poof.listTransactions({
      $,
    });

    $.export("$summary", "Successfully retrieved transactions.");

    return response;
  },
};
