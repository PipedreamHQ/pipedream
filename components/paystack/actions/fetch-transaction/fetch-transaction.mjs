import paystack from "../../paystack.app.mjs";

export default {
  key: "paystack-fetch-transaction",
  name: "Fetch Transaction",
  description: "Fetch a single transaction. [See the documentation](https://paystack.com/docs/api/transaction/#fetch)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    paystack,
    transactionID: {
      propDefinition: [
        paystack,
        "transactionID",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paystack.fetchTransaction({
      $,
      transactionID: this.transactionID,
    });

    $.export("$summary", `Successfully fetched transaction with ID ${response.data.id}`);
    return response;
  },
};
