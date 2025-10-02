import polygonscan from "../../polygonscan.app.mjs";

export default {
  key: "polygonscan-get-account-balance",
  name: "Get Account Balance",
  description: "Retrieves the balance of a specific address within the Polygon network. [See the documentation](https://docs.polygonscan.com/api-endpoints/accounts#get-matic-balance-for-a-single-address)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    polygonscan,
    address: {
      propDefinition: [
        polygonscan,
        "address",
      ],
    },
    blockNumber: {
      type: "integer",
      label: "Block Number",
      description: "The block number to check balance for",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.polygonscan.getBalance({
      address: this.address,
      blockNumber: this.blockNumber,
    });

    $.export("$summary", `Successfully retrieved the balance for address ${this.address}`);
    return response;
  },
};
