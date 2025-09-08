import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-market-get-market-trades",
  name: "Spot - Market - Get Market Trades",
  description: "Retrieve market trade history for a specified symbol. [See the documentation](https://www.bitget.com/api-doc/spot/market/Get-Market-Trades)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    symbol: {
      optional: false,
      propDefinition: [
        app,
        "symbol",
      ],
    },
    idLessThan: {
      label: "ID Less Than",
      description: "Returns records less than the specified ID",
      propDefinition: [
        app,
        "tradeId",
        ({ symbol }) => ({
          symbol,
        }),
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Start time, Unix millisecond timestamp and should be within 7 days. E.g. `1690196141868`.",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "End time, Unix millisecond timestamp and should be within 7 days. E.g. `1690196141868`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default: `500`, Maximum: `1000`",
      optional: true,
      min: 1,
      max: 1000,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      limit,
      idLessThan,
      startTime,
      endTime,
    } = this;

    const response = await app.getSpotMarketTrades({
      $,
      params: {
        symbol,
        limit,
        idLessThan,
        startTime,
        endTime,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response?.data?.length}\` market trades for \`${symbol}\``);
    return response;
  },
};
