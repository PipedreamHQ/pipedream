import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "polygonscan",
  propDefinitions: {
    address: {
      type: "string",
      label: "Address",
      description: "The address to watch for new transactions or to fetch the balance.",
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
    transactionHash: {
      type: "string",
      label: "Transaction Hash",
      description: "The hash of a specific transaction to fetch.",
    },
    contractAddress: {
      type: "string",
      label: "Contract Address",
      description: "The contract address to interact with.",
    },
    blockNumber: {
      type: "integer",
      label: "Block Number",
      description: "The block number to check balance for",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.polygonscan.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        params: {
          apikey: this.$auth.api_key,
          ...params,
        },
        headers,
      });
    },
    async getTransactionByHash({ transactionHash }) {
      return this._makeRequest({
        path: "",
        params: {
          module: "transaction",
          action: "getstatus",
          txhash: transactionHash,
        },
      });
    },
    async getContractABI({ contractAddress }) {
      return this._makeRequest({
        path: "",
        params: {
          module: "contract",
          action: "getabi",
          address: contractAddress,
        },
      });
    },
    async getBalance({
      address, blockNumber,
    }) {
      const params = {
        module: "account",
        action: "balance",
        address: address,
        tag: "latest",
      };
      if (blockNumber) {
        params.tag = blockNumber.toString();
      }
      return this._makeRequest({
        path: "",
        params: params,
      });
    },
    async getTransactionsByAddress({
      address, startBlock, endBlock, page, offset, sort,
    }) {
      return this._makeRequest({
        path: "",
        params: {
          module: "account",
          action: "txlist",
          address: address,
          startblock: startBlock,
          endblock: endBlock,
          page: page,
          offset: offset,
          sort: sort,
        },
      });
    },
  },
};
