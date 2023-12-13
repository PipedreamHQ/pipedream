import polygonscan from "../../polygonscan.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "polygonscan-get-account-balance",
  name: "Get Account Balance",
  description: "Retrieves the balance of a specific address within the Polygon network. [See the documentation](https://docs.polygonscan.com/api-endpoints/accounts)",
  version: "0.0.{{ts}}",
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
      propDefinition: [
        polygonscan,
        "blockNumber",
      ],
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
