import polygonscan from "../../polygonscan.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "polygonscan-retrieve-transaction-details",
  name: "Retrieve Transaction Details",
  description: "Fetches the details of a specific transaction by its transaction hash. [See the documentation](https://docs.polygonscan.com/api-endpoints/stats)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    polygonscan,
    transactionHash: {
      propDefinition: [
        polygonscan,
        "transactionHash",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.polygonscan.getTransactionByHash({
      transactionHash: this.transactionHash,
    });

    $.export("$summary", `Successfully retrieved transaction details for hash ${this.transactionHash}`);
    return response.data;
  },
};
