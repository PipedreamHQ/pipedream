import polygonscan from "../../polygonscan.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "polygonscan-query-contract-abi",
  name: "Query Contract ABI",
  description: "Obtains the contract ABI of a smart contract on the Polygon network. [See the documentation](https://docs.polygonscan.com/api-endpoints/contracts)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    polygonscan,
    contractAddress: {
      propDefinition: [
        polygonscan,
        "contractAddress",
      ],
    },
    startBlock: {
      type: "integer",
      label: "Start Block",
      description: "The starting block from which to begin searching for transactions.",
      optional: true,
    },
    endBlock: {
      type: "integer",
      label: "End Block",
      description: "The ending block up to which to search for transactions.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page Number",
      description: "The page number to fetch.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of records to return per page.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort Order",
      description: "The sort order of the transactions. Can be 'asc' or 'desc'.",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      module: "contract",
      action: "getabi",
      address: this.contractAddress,
    };

    if (this.startBlock) params.startblock = this.startBlock;
    if (this.endBlock) params.endblock = this.endBlock;
    if (this.page) params.page = this.page;
    if (this.offset) params.offset = this.offset;
    if (this.sort) params.sort = this.sort;

    const response = await this.polygonscan.getContractABI({
      contractAddress: this.contractAddress,
      params,
    });

    $.export("$summary", `Successfully retrieved the contract ABI for address ${this.contractAddress}`);
    return response;
  },
};
