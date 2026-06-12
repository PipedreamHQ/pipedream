import app from "../../codex.app.mjs";

export default {
  key: "codex-get-pair-stats",
  name: "Get Pair Stats",
  description:
    "Returns metadata and trading statistics for a token pair: price, volume, liquidity, and price changes across multiple timeframes."
    + " Use this to analyze DEX pair activity (e.g., Uniswap V2/V3 pools)."
    + " `statsType` `FILTERED` removes wash trades for cleaner signal; `UNFILTERED` includes all activity."
    + " Use **Get Networks** to resolve the numeric `networkId` if needed."
    + " [See the documentation](https://docs.codex.io/reference/pairmetadata)",
  version: "0.0.2",
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
  },
  async run({ $ }) {
    const QUERY = `
      query GetPairMetadata($pairId: String!, $statsType: TokenPairStatisticsType) {
        pairMetadata(pairId: $pairId, statsType: $statsType) {
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
    const data = await this.app.makeRequest(QUERY, {
      pairId,
      statsType: this.statsType || "FILTERED",
    });

    const result = data.pairMetadata;
    $.export("$summary", `Retrieved trading stats for pair ${this.pairAddress}`);
    return result;
  },
};
