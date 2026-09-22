import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "codex",
  propDefinitions: {
    networkId: {
      type: "integer",
      label: "Network ID",
      description: "Numeric blockchain network ID. Use **Get Networks** to list all supported networks and their IDs (e.g., 1 = Ethereum, 137 = Polygon).",
    },
    tokenAddress: {
      type: "string",
      label: "Token Address",
      description: "On-chain contract address of the token (e.g., `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2` for WETH).",
    },
    walletAddress: {
      type: "string",
      label: "Wallet Address",
      description: "On-chain wallet address (e.g., `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
      default: 20,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor from a previous response's `cursor` field. Omit for the first page.",
      optional: true,
    },
  },
  methods: {
    async makeRequest($, query, variables = {}) {
      const response = await axios($, {
        method: "POST",
        url: "https://graph.codex.io/graphql",
        headers: {
          "Authorization": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        data: {
          query,
          variables,
        },
      });
      if (response.errors?.length) {
        throw new Error(response.errors.map((e) => e.message).join("; "));
      }
      return response.data;
    },
  },
};
