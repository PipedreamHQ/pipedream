import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "polygonscan",
  propDefinitions: {
    address: {
      type: "string",
      label: "Address",
      description: "The address to watch for new transactions.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.polygonscan.com/api";
    },
    _makeRequest({
      $ = this, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(),
        params: {
          apikey: this.$auth.api_key,
          ...params,
        },
        ...opts,
      });
    },
    getTransactionByHash({ transactionHash }) {
      return this._makeRequest({
        params: {
          module: "transaction",
          action: "gettxreceiptstatus",
          txhash: transactionHash,
        },
      });
    },
    getContractABI({ contractAddress }) {
      return this._makeRequest({
        params: {
          module: "contract",
          action: "getabi",
          address: contractAddress,
        },
      });
    },
    getBalance({
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
        params,
      });
    },
    getTransactionsByAddress({
      params, ...opts
    }) {
      return this._makeRequest({
        params: {
          module: "account",
          action: "txlist",
          ...params,
        },
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        params.offset = LIMIT;
        const { result } = await fn({
          params,
        });
        for (const d of result) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = result.length;

      } while (hasMore);
    },
  },
};
