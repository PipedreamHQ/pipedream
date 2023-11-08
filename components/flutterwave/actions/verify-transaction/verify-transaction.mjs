import flutterwave from "../../flutterwave.app.mjs"

export default {
  key: "flutterwave-verify-transaction",
  name: "Verify Transaction",
  description: "Confirms a given transaction. [See the documentation](https://developer.flutterwave.com/reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flutterwave,
    transaction: {
      propDefinition: [
        flutterwave,
        "transaction"
      ]
    },
  },
  async run({ $ }) {
    const response = await this.flutterwave.confirmTransaction({
      transaction: this.transaction,
    })
    $.export("$summary", `Transaction ${{this.transaction}} confirmed. Status: ${{response.status}}`)
    return response
  },
}