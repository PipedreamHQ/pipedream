import polygonscan from "../../polygonscan.app.mjs";

export default {
  key: "polygonscan-retrieve-transaction-details",
  name: "Retrieve Transaction Details",
  description: "Fetches the details of a specific transaction by its transaction hash. [See the documentation](https://docs.polygonscan.com/api-endpoints/stats)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    polygonscan,
    transactionHash: {
      type: "string",
      label: "Transaction Hash",
      description: "The hash of a specific transaction to fetch.",
    },
  },
  async run({ $ }) {
    const response = await this.polygonscan.getTransactionByHash({
      transactionHash: this.transactionHash,
    });

    $.export("$summary", `Successfully retrieved transaction details for hash ${this.transactionHash}`);
    return response;
  },
};
