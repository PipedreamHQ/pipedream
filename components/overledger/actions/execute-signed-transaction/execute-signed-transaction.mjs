import overledger from "../../overledger.app.mjs";

export default {
  key: "overledger-execute-signed-transaction",
  name: "Execute Signed Transaction",
  description: "Executes a signed transaction by sending it to a blockchain node via Overledger. [See the documentation](https://developers.quant.network/reference/executesignedrequest)",
  version: "0.0.1",
  type: "action",
  props: {
    overledger,
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The ID of the request for executing a signed transaction.",
    },
    signedTransaction: {
      type: "string",
      label: "Signed Transaction",
      description: "The signed transaction data.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.overledger.executeSignedTransaction({
      $,
      data: {
        requestId: this.requestId,
        signedTransaction: this.signedTransaction,
      },
    });

    $.export("$summary", `Successfully executed signed transaction with Request ID ${this.requestId}`);
    return response;
  },
};
