import {
  NETWORK_OPTIONS, TECHNOLOGY_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import overledger from "../../overledger.app.mjs";

export default {
  key: "overledger-prepare-smart-contract-transaction",
  name: "Prepare Smart Contract Transaction",
  description: "Prepares a smart contract transaction for signing on the Overledger platform. [See the documentation](https://developers.quant.network/reference/preparesmartcontractwrite)",
  version: "0.0.1",
  type: "action",
  props: {
    overledger,
    locationTechnology: {
      type: "string",
      label: "Location Technology",
      description: "The technology of the blockchain that the transaction will be submitted to",
      options: TECHNOLOGY_OPTIONS,
      reloadProps: true,
    },
    signingAccountId: {
      type: "string",
      label: "Signing Account ID",
      description: "The blockchain account that will sign the transaction.",
    },
    functionName: {
      type: "string",
      label: "Function Name",
      description: "The name of the function to call on the smart contract.",
    },
    smartContractId: {
      propDefinition: [
        overledger,
        "smartContractId",
      ],
    },
    inputParameters: {
      type: "string[]",
      label: "Input Parameters",
      description: "The input parameters for the smart contract function, in JSON format.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.locationTechnology) {
      props.locationNetwork = {
        type: "string",
        label: "Location Network",
        description: "The blockchain network the transaction will be submitted to.",
        options: NETWORK_OPTIONS[this.locationTechnology],
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.overledger.prepareSmartContractTransaction({
      $,
      data: {
        location: {
          technology: this.locationTechnology,
          network: this.locationNetwork,
        },
        signingAccountId: this.signingAccountId,
        functionName: this.functionName,
        smartContractId: this.smartContractId,
        inputParameters: this.inputParameters && parseObject(this.inputParameters),
      },
    });
    $.export("$summary", "Smart contract transaction prepared successfully");
    return response;
  },
};
