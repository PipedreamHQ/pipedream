import {
  NETWORK_OPTIONS, TECHNOLOGY_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import overledger from "../../overledger.app.mjs";

export default {
  key: "overledger-read-from-smart-contract",
  name: "Read from Smart Contract",
  description: "Reads data from a specified smart contract on the Overledger network.",
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
    functionName: {
      type: "string",
      label: "Function Name",
      description: "The name of the function to call on the smart contract.",
    },
    inptParameters: {
      type: "string[]",
      label: "Input Parameters",
      description: "The input parameters for the smart contract function, in JSON format.",
      optional: true,
    },
    smartContractId: {
      propDefinition: [
        overledger,
        "smartContractId",
      ],
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
    const response = await this.overledger.readFromSmartContract({
      $,
      data: {
        location: {
          technology: this.locationTechnology,
          network: this.locationNetwork,
        },
        functionName: this.functionName,
        smartContractId: this.smartContractId,
        inputParameters: this.inputParameters && parseObject(this.inputParameters),
      },
    });

    $.export("$summary", `Successfully read from contract: ${this.smartContractId}`);
    return response;
  },
};
