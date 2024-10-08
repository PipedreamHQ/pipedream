import overledger from "../../overledger.app.mjs";
import { UNIT_OPTIONS } from "../../common/constants.mjs";

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
      description: "The ID assigned to a preparation request in Overledger. This should be set to the requestId parameter found in the response object of the 'Prepare Smart Contract Transaction' Overledger action.",
    },
    transactionSigningResponderName: {
      type: "string",
      label: "Transaction Signing Responder Name",
      description: "The name of the Transaction Signing Responder you would like to use. The CTA Transaction Signing Responder is the Quant-provided signer for testnet accounts.",
    },
    nativeData: {
      type: "object",
      label: "the transaction data required to be signed",
      description: "A JSON object representing the transaction required to be signed.",
    },
    locationTechnology: {
      type: "string",
      label: "Location Technology",
      description: "The blockchain technology used for this transaction, e.g., ethereum, substrate.",
      optional: true,
      // Reference the output of the previous step
      default: ({ steps }) => steps.prepare_smart_contract_transaction?.locationTechnology,
    },
  },
  async run({ $ }) {
    const gatewayFee = {
      amount: "100",
      unit: "QNT",
    };
    // Define DLT Fee and dynamically set the 'unit' from UNIT_OPTIONS
    const dltFee = {
      amount: "0.000019897764079968",
      unit: UNIT_OPTIONS[this.locationTechnology] || "ETH" // Use default if not found
    };
    // Sign the transaction
    const requestBody = {
      keyId: this.keyId,
      gatewayFee: gatewayFee,
      requestId: this.requestId,
      dltFee: dltFee,
      nativeData: this.nativeData,
      transactionSigningResponderName: this.transactionSigningResponderName,
    }

    const response = await this.overledger.signTransaction({
      $,
      data: requestBody,
    });
    $.export("$summary", "Transaction signed successfully");
    return response;
  },
};
