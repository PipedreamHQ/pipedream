import app from "../../codex.app.mjs";

export default {
  key: "codex-get-token-chart",
  name: "Get Token Chart",
  description:
    "Returns OHLCV (open, high, low, close, volume) candlestick bars for a token over a time range."
    + " Use this for price charts, trend analysis, or historical data."
    + " Use **Get Networks** to resolve `networkId` if needed."
    + " `from` and `to` are Unix timestamps in seconds (e.g., current time = `Math.floor(Date.now() / 1000)`)."
    + " Valid resolutions: `1` (1 min), `5`, `15`, `30`, `60` (1 hr), `240` (4 hr), `720` (12 hr), `1D`, `7D`."
    + " [See the documentation](https://docs.codex.io/api-reference/queries/gettokenbars)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    address: {
      propDefinition: [
        app,
        "tokenAddress",
      ],
    },
    networkId: {
      propDefinition: [
        app,
        "networkId",
      ],
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "Candle interval. Use `60` for hourly, `1D` for daily, `7D` for weekly.",
      options: [
        {
          label: "1 minute",
          value: "1",
        },
        {
          label: "5 minutes",
          value: "5",
        },
        {
          label: "15 minutes",
          value: "15",
        },
        {
          label: "30 minutes",
          value: "30",
        },
        {
          label: "1 hour",
          value: "60",
        },
        {
          label: "4 hours",
          value: "240",
        },
        {
          label: "12 hours",
          value: "720",
        },
        {
          label: "1 day",
          value: "1D",
        },
        {
          label: "7 days",
          value: "7D",
        },
      ],
      default: "60",
    },
    from: {
      type: "integer",
      label: "From (Unix timestamp)",
      description: "Start of the time range as a Unix timestamp in seconds.",
    },
    to: {
      type: "integer",
      label: "To (Unix timestamp)",
      description: "End of the time range as a Unix timestamp in seconds. Defaults to now if not provided.",
      optional: true,
    },
    statsType: {
      type: "string",
      label: "Stats Type",
      description: "The type of statistics returned. Can be FILTERED or UNFILTERED. Default is UNFILTERED.",
      options: [
        "FILTERED",
        "UNFILTERED",
      ],
      optional: true,
    },
    countback: {
      type: "integer",
      label: "Countback",
      description: "Guarantees number of bars returned is at most this number. Use countback: 1500 with from: 0 for maximum results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const QUERY = `
      query GetTokenChart($symbol: String!, $from: Int!, $to: Int!, $resolution: String!, $removeEmptyBars: Boolean, $statsType: TokenStatisticsType, $countback: Int) {
        getBars(symbol: $symbol, from: $from, to: $to, resolution: $resolution, removeEmptyBars: $removeEmptyBars, statsType: $statsType, countback: $countback) {
          o
          h
          l
          c
          v
          t
        }
      }
    `;

    const symbol = `${this.address}:${this.networkId}`;
    const to = this.to ?? Math.floor(Date.now() / 1000);

    const data = await this.app.makeRequest($, QUERY, {
      symbol,
      from: this.from,
      to,
      resolution: this.resolution,
      removeEmptyBars: true,
      statsType: this.statsType || "UNFILTERED",
      countback: this.countback,
    });

    const bars = data.getBars;
    $.export("$summary", `Retrieved ${bars.length} ${this.resolution}-resolution bars for ${symbol}`);
    return bars;
  },
};
