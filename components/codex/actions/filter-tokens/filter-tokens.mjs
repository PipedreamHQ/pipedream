import app from "../../codex.app.mjs";
import { SORT_RANKINGS } from "../../common/constants.mjs";

export default {
  key: "codex-filter-tokens",
  name: "Filter Tokens",
  description:
    "Discovers and ranks tokens by on-chain signals such as volume, trending score, liquidity, or market cap."
    + " Use this to find trending tokens, top movers, or tokens matching a search phrase."
    + " To look up a specific token by its known contract address, use **Get Token Details** instead."
    + " Filter to a specific network by passing a numeric `networkId` (e.g., `1` for Ethereum, `137` for Polygon)."
    + " Use **Get Networks** to find numeric network IDs."
    + " [See the documentation](https://docs.codex.io/api-reference/queries/filtertokens)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    phrase: {
      type: "string",
      label: "Search Phrase",
      description: "Search tokens by name or symbol (e.g., `PEPE`, `Uniswap`). Leave blank to browse by ranking.",
      optional: true,
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
      ],
      optional: true,
      description: "Filter results to a single blockchain network. Example: `1` for Ethereum, `137` for Polygon. Leave blank for all networks. Use **Get Networks** to find IDs.",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Ranking signal to sort results by.",
      options: [
        {
          label: "24h Volume (highest first)",
          value: "volume24",
        },
        {
          label: "Trending Score",
          value: "trendingScore",
        },
        {
          label: "Liquidity",
          value: "liquidity",
        },
        {
          label: "Holders",
          value: "holders",
        },
        {
          label: "Market Cap",
          value: "marketCap",
        },
        {
          label: "24h Price Change",
          value: "priceChange24",
        },
      ],
      optional: true,
      default: "volume24",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      default: 10,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip for pagination.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const QUERY = `
      query FilterTokens($filters: TokenFilters, $phrase: String, $rankings: [TokenRanking], $limit: Int, $offset: Int) {
        filterTokens(filters: $filters, phrase: $phrase, rankings: $rankings, limit: $limit, offset: $offset) {
          results {
            token {
              address
              name
              symbol
              networkId
            }
            priceUSD
            volume24
            liquidity
            trendingScore
            holders
            change24
          }
          count
        }
      }
    `;

    const rankings = this.sortBy
      ? SORT_RANKINGS[this.sortBy] ?? SORT_RANKINGS.volume24
      : SORT_RANKINGS.volume24;

    const filters = this.networkId
      ? {
        network: this.networkId,
      }
      : undefined;

    const data = await this.app.makeRequest($, QUERY, {
      phrase: this.phrase || undefined,
      rankings,
      filters,
      limit: this.limit,
      offset: this.offset || 0,
    });

    const {
      results, count,
    } = data.filterTokens;
    $.export("$summary", `Found ${count} tokens (showing ${results.length})`);
    return {
      results,
      count,
    };
  },
};
