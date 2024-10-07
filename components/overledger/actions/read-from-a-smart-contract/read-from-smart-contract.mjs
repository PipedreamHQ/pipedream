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
    inputParameters: {
      type: "string[]",
      label: "Input Parameters - Stringified Objects",
      description: "The input parameters for the smart contract function, in JSON string format. Example: `['{\"type\":\"string\",\"value\":\"param1\"}', '{\"type\":\"uint256\",\"value\":\"param2\"}']`",
      optional: true,
    },
    smartContractId: {
      type: "string",
      label: "Smart Contract ID",
      description: "The ID/address of the smart contract to interact with.",
    },
    outputParameters: {
      type: "string[]",
      label: "Output Parameters",
      description: "The type of output parameter required e.g., address, string",
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

    const requestBody = {
      location: {
        technology: this.locationTechnology,
        network: this.locationNetwork,
      },
      functionName: this.functionName,
      inputParameters: parseObject(this.inputParameters),
      smartContractId: this.smartContractId,
      outputParameters: parseObject(this.outputParameters),
    };

    try {
      // Make the API call to Overledger
      const response = await this.overledger.readFromSmartContract({
        $,
        data: requestBody,
      });
      $.export("$summary", `Successfully read from contract: ${this.smartContractId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to read from smart contract: ${error.message}`);
    }
  },
};
