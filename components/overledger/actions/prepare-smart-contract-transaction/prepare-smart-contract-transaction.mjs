import overledger from "../../overledger.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "overledger-prepare-smart-contract-transaction",
  name: "Prepare Smart Contract Transaction",
  description: "Prepares a smart contract transaction for signing on the Overledger platform. Required props are 'location', 'signingAccountId', 'functionName', and 'smartContractId'. An optional prop could be provided - 'inputParameters'. [See the documentation](https://developers.quant.network/reference/preparesmartcontractwrite)",
  version: "0.0.1",
  type: "action",
  props: {
    overledger,
    location: {
      propDefinition: [
        overledger,
        "location",
      ],
    },
    signingAccountId: {
      propDefinition: [
        overledger,
        "signingAccountId",
      ],
    },
    functionName: {
      propDefinition: [
        overledger,
        "functionName",
      ],
    },
    smartContractId: {
      propDefinition: [
        overledger,
        "smartContractId",
      ],
    },
    inputParameters: {
      ...overledger.propDefinitions.inputParameters,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.overledger.prepareSmartContractTransaction({
      location: this.location,
      signingAccountId: this.signingAccountId,
      functionName: this.functionName,
      smartContractId: this.smartContractId,
      inputParameters: this.inputParameters
        ? this.inputParameters.map(JSON.parse)
        : undefined,
    });
    $.export("$summary", "Smart contract transaction prepared successfully");
    return response;
  },
};
