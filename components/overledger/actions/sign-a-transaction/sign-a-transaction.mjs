import overledger from "../../overledger.app.mjs";
import {
  TECHNOLOGY_OPTIONS, UNIT_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "overledger-sign-a-transaction",
  name: "Sign a transaction",
  description: "Sign a transaction using Overledger - Part 2 of [Overledger Pattern](https://developers.quant.network/reference/overledger-pattern). [See documentation](https://developers.quant.network/reference/sandboxsigning)",
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
    locationTechnology: {
      type: "string",
      label: "Location Technology",
      description: "The blockchain technology used for this transaction, e.g., ethereum, substrate - required in order to set the dltfee",
      options: TECHNOLOGY_OPTIONS,
      reloadProps: true,
    },
    keyId: {
      type: "string",
      label: "Signing Account ID",
      description: "The ID/address of the blockchain account that will sign the transaction.",
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The Request ID assigned to a preparation request in Overledger. This should be set to the requestId parameter found in the response object of the 'Prepare Transaction' Overledger action.",
    },
    transactionSigningResponderName: {
      type: "string",
      label: "Transaction Signing Responder Name",
      description: "The name of the Transaction Signing Responder you would like to use. The CTA Transaction Signing Responder is the Quant-provided signer for testnet accounts.",
    },
    nativeData: {
      type: "object",
      label: "Native Data",
      description: "An object representing the transaction required to be signed - This should be set to the nativeData object of the 'Prepare Transaction' Overledger action.",
    },
  },
  async run({ $ }) {
    //default values of gatewayFee and dltfee hard coded into params.
    const gatewayFee = {
      amount: "0",
      unit: "QNT",
    };
    // Define DLT Fee and dynamically set the 'unit/symbol' from UNIT_OPTIONS
    const dltFee = {
      amount: "0.000019897764079968",
      unit: UNIT_OPTIONS[this.locationTechnology] || "ETH", // Use default if not found
    };
    // Sign the transaction
    const requestBody = {
      keyId: this.keyId,
      gatewayFee: gatewayFee,
      requestId: this.requestId,
      dltFee: dltFee,
      nativeData: this.nativeData,
      transactionSigningResponderName: this.transactionSigningResponderName,
    };

    const response = await this.overledger.signTransaction({
      $,
      environment: this.environment,
      data: requestBody,
    });
    $.export("$summary", "Transaction signed successfully");
    return response;
  },
};
