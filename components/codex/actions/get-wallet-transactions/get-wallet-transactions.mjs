import app from "../../codex.app.mjs";

export default {
  key: "codex-get-wallet-transactions",
  name: "Get Wallet Transactions",
  description:
    "Returns token holdings and aggregated trading stats for one or more wallet addresses."
    + " Each result includes token balance, realized P&L, buy/sell counts, and average hold period across 1d, 1w, 30d, and 1y windows."
    + " Filter by wallet address, token, network, labels, or numeric range filters."
    + " Use **Get Networks** to resolve the numeric `networkId` if needed."
    + " Supports offset-based pagination — pass `offset` (and optional `limit`) to fetch subsequent pages."
    + " [See the documentation](https://docs.codex.io/api-reference/queries/filtertokenwallets)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    wallets: {
      type: "string[]",
      label: "Wallet Addresses",
      description: "Filter results to one or more wallet addresses.",
      optional: true,
    },
    tokenIds: {
      type: "string[]",
      label: "Token IDs",
      description: "Filter by token(s) in `address:networkId` format (e.g., `0xc02aaa...c756cc2:1`). Maximum 50 per request.",
      optional: true,
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
      ],
      optional: true,
      description: "Filter results to a specific blockchain network. Use **Get Networks** to find IDs.",
    },
    phrase: {
      type: "string",
      label: "Search Phrase",
      description: "Search phrase for wallet filtering.",
      optional: true,
    },
    includeLabels: {
      type: "string[]",
      label: "Include Labels",
      description: "Return only wallets that have all of the specified labels.",
      optional: true,
    },
    excludeLabels: {
      type: "string[]",
      label: "Exclude Labels",
      description: "Exclude wallets that have any of the specified labels.",
      optional: true,
    },
    rankings: {
      type: "string",
      label: "Rankings",
      description: "Sort results by one or more attributes. Provide a JSON array of ranking objects, each with `attribute` (e.g., `tokenBalanceLiveUsd`, `realizedProfitUsd1w`) and `direction` (`ASC` or `DESC`). Example: `[{\"attribute\": \"realizedProfitUsd1w\", \"direction\": \"DESC\"}]`.",
      optional: true,
    },
    filtersV2: {
      type: "string",
      label: "Filters",
      description: "Numeric range filters as a JSON object. Supports `gt`, `gte`, `lt`, `lte` operators on fields like `tokenBalanceLiveUsd`, `realizedProfitUsd1w`, `buys1d`, `sells1d`, etc. Example: `{\"tokenBalanceLiveUsd\": {\"gt\": 1000}}`.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      default: 20,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip. Use with `limit` to page through results (e.g., `offset: 20`, `limit: 20` fetches the second page).",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const QUERY = `
      query GetWalletTransactions($input: FilterTokenWalletsInput!) {
        filterTokenWallets(input: $input) {
          count
          offset
          results {
            address
            tokenAddress
            networkId
            firstTransactionAt
            lastTransactionAt
            tokenBalance
            tokenBalanceLive
            tokenBalanceLiveUsd
            purchasedTokenBalance
            tokenAcquisitionCostUsd
            buys1d
            sells1d
            buys1w
            sells1w
            buys30d
            sells30d
            realizedProfitUsd1d
            realizedProfitUsd1w
            realizedProfitUsd30d
            realizedProfitPercentage1d
            realizedProfitPercentage1w
            realizedProfitPercentage30d
            labels
          }
        }
      }
    `;

    let rankings;
    if (this.rankings) {
      try {
        rankings = JSON.parse(this.rankings);
      } catch (error) {
        throw new Error("Invalid JSON for \"Rankings\": please provide a valid JSON array.");
      }
    }
    let filtersV2;
    if (this.filtersV2) {
      try {
        filtersV2 = JSON.parse(this.filtersV2);
      } catch (error) {
        throw new Error("Invalid JSON for \"Filters\": please provide a valid JSON object.");
      }
    }

    const input = {
      wallets: this.wallets?.length
        ? this.wallets
        : undefined,
      tokenIds: this.tokenIds?.length
        ? this.tokenIds
        : undefined,
      networkId: this.networkId || undefined,
      phrase: this.phrase || undefined,
      includeLabels: this.includeLabels?.length
        ? this.includeLabels
        : undefined,
      excludeLabels: this.excludeLabels?.length
        ? this.excludeLabels
        : undefined,
      rankings,
      filtersV2,
      limit: this.limit,
      offset: this.offset || 0,
    };

    const data = await this.app.makeRequest($, QUERY, {
      input,
    });

    const result = data.filterTokenWallets;
    const count = result.results?.length ?? 0;
    $.export("$summary", `Retrieved ${count} wallet token result(s)`);
    return result;
  },
};
