import overledger from "../../overledger.app.mjs";

export default {
  key: "overledger-sign-smart-contract-transaction",
  name: "Sign Smart Contract Transaction",
  description: "Sign and send a transaction to a smart contract using Overledger",
  version: "0.0.1",
  type: "action",
  props: {
    overledger,
    keyId: {
      type: "string",
      label: "Signing Account ID",
      description: "The blockchain account that will sign the transaction.",
    },
    requestId: {
      type: "string",
      label: "requestId",
      description: "The Overledger identifier assigned to the related transaction preparation request. This should be set to the requestId parameter found in the response object of the 'Prepare a Smart Contract Transaction' Overledger action.",
    },
    transactionSigningResponderName: {
      type: "string",
      label: "Transaction Signing Responder",
      description: "The name of the Transaction Signing Responder you would like to use. The CTA Transaction Signing Responder is the Quant-provided signer for testnet accounts.",
    },
    nativeData: {
      type: "object",
      label: "the transaction data required to be signed",
      description: "A JSON object representing the transaction required to be signed.",
    },
  },
  async run({ $ }) {
    // Sign the transaction
    const response = await this.overledger.signTransaction({
      $,
      data: {
        requestId: this.requestId,
        nativeData: this.nativeData,
      },
    });
    $.export("$summary", "Transaction signed successfully");
    return response;
  },
};
