import overledger from "../../overledger.app.mjs";

export default {
  key: "overledger-execute-signed-transaction",
  name: "Execute Signed Transaction",
  description: "Executes a signed transaction by sending it to a blockchain node via Overledger. [See the documentation](https://developers.quant.network/reference/executesignedrequest)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overledger,
    environment: {
      propDefinition: [
        overledger,
        "environment",
      ],
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The Overledger identifier assigned to the related transaction preparation request. This should be set to the requestId parameter found in the response object of the 'Prepare a Smart Contract Transaction' Overledger action.",
    },
    signedTransaction: {
      type: "string",
      label: "Signed Transaction",
      description: "The raw transaction bytecode after signing. This should be set to the signed parameter found in the response object of the 'Sign a Transaction' Overledger action.",
      optional: true,
    },
  },
  async run({ $ }) {

    const requestBody = {
      requestId: this.requestId,
      signedTransaction: this.signedTransaction,
    };

    const response = await this.overledger.executeSignedTransaction({
      $,
      environment: this.environment,
      data: requestBody,
    });

    $.export("$summary", `Successfully executed signed transaction with Request ID ${this.requestId}`);
    return response;
  },
};
