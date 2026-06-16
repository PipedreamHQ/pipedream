import app from "../../codex.app.mjs";

export default {
  key: "codex-get-pair-stats",
  name: "Get Pair Stats",
  description:
    "Returns metadata and trading statistics for a token pair: price, volume, liquidity, and price changes across multiple timeframes."
    + " Use this to analyze DEX pair activity (e.g., Uniswap V2/V3 pools)."
    + " `statsType` `FILTERED` removes wash trades for cleaner signal; `UNFILTERED` includes all activity."
    + " Use **Get Networks** to resolve the numeric `networkId` if needed."
    + " [See the documentation](https://docs.codex.io/api-reference/queries/getdetailedpairstats)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    pairAddress: {
      type: "string",
      label: "Pair Address",
      description: "Contract address of the trading pair (e.g., `0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc` for WETH/USDC Uniswap V2).",
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
      ],
    },
    statsType: {
      type: "string",
      label: "Stats Type",
      description: "`FILTERED` removes wash trades for cleaner data (default). `UNFILTERED` returns all raw activity.",
      options: [
        {
          label: "Filtered (wash-trade removed)",
          value: "FILTERED",
        },
        {
          label: "Unfiltered (all activity)",
          value: "UNFILTERED",
        },
      ],
      optional: true,
      default: "FILTERED",
    },
    tokenOfInterest: {
      type: "string",
      label: "Token Of Interest",
      description: "The token of interest used to calculate token-specific stats for the pair. Can be `token0` or `token1`.",
      options: [
        "token0",
        "token1",
      ],
      optional: true,
    },
    timestamp: {
      type: "integer",
      label: "Timestamp",
      description: "The unix timestamp for the stats. Defaults to current.",
      optional: true,
    },
    durations: {
      type: "string[]",
      label: "Durations",
      description: "The list of durations to get detailed pair stats for.",
      options: [
        "day30",
        "week1",
        "day1",
        "hour12",
        "hour4",
        "hour1",
        "min15",
        "min5",
      ],
      optional: true,
    },
    bucketCount: {
      type: "integer",
      label: "Bucket Count",
      description: "The number of aggregated values to receive. Note: Each duration has predetermined bucket sizes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const QUERY = `
      query GetDetailPairStats($pairId: String!, $statsType: TokenPairStatisticsType, $tokenOfInterest: String, $timestamp: Int, $durations: [String!], $bucketCount: Int) {
        pairStats(pairId: $pairId, statsType: $statsType, tokenOfInterest: $tokenOfInterest, timestamp: $timestamp, durations: $durations, bucketCount: $bucketCount) {
          pairAddress
          networkId
          price
          priceChange1
          priceChange4
          priceChange12
          priceChange24
          volume1
          volume4
          volume12
          volume24
          liquidity
        }
      }
    `;

    const pairId = `${this.pairAddress}:${this.networkId}`;
    const data = await this.app.makeRequest($, QUERY, {
      pairId,
      statsType: this.statsType || "FILTERED",
      tokenOfInterest: this.tokenOfInterest,
      timestamp: this.timestamp,
      durations: this.durations,
      bucketCount: this.bucketCount,
    });

    const result = data.pairStats;
    $.export("$summary", `Retrieved trading stats for pair ${this.pairAddress}`);
    return result;
  },
};
