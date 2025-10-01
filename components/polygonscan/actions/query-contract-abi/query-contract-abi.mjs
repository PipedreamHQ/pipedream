import polygonscan from "../../polygonscan.app.mjs";

export default {
  key: "polygonscan-query-contract-abi",
  name: "Query Contract ABI",
  description: "Obtains the contract ABI of a smart contract on the Polygon network. [See the documentation](https://docs.polygonscan.com/api-endpoints/contracts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    polygonscan,
    contractAddress: {
      type: "string",
      label: "Contract Address",
      description: "The contract address to interact with.",
    },
  },
  async run({ $ }) {
    const response = await this.polygonscan.getContractABI({
      contractAddress: this.contractAddress,
    });

    $.export("$summary", `Successfully retrieved the contract ABI for address ${this.contractAddress}`);
    return response;
  },
};
