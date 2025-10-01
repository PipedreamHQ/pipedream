import flutterwave from "../../flutterwave.app.mjs";

export default {
  key: "flutterwave-verify-transaction",
  name: "Verify Transaction",
  description: "Confirms a given transaction. [See the documentation](https://developer.flutterwave.com/reference/endpoints/transactions#verify-a-transaction)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    flutterwave,
    transaction: {
      propDefinition: [
        flutterwave,
        "transaction",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flutterwave.confirmTransaction({
      transaction: this.transaction,
      $,
    });
    if (response?.status) {
      $.export("$summary", `Transaction ${this.transaction} confirmed. Status: ${response.status}.`);
    }
    return response;
  },
};
