import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-trade-get-fills",
  name: "Spot - Trade - Get Fills",
  description: "Retrieve transaction details (fills) for a user. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Get-Fills)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    symbol: {
      propDefinition: [
        app,
        "symbol",
      ],
    },
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    startTime: {
      propDefinition: [
        app,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        app,
        "endTime",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default: `100`, maximum: `100`.",
      optional: true,
      min: 1,
      max: 100,
    },
    idLessThan: {
      label: "ID Less Than",
      description: "Requests the content on the page before this ID (older data), the value input should be the tradeId of the corresponding interface.",
      propDefinition: [
        app,
        "tradeId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      orderId,
      startTime,
      endTime,
      limit,
      idLessThan,
    } = this;

    const response = await app.getSpotTradeFills({
      $,
      params: {
        symbol,
        orderId,
        startTime,
        endTime,
        limit,
        idLessThan,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response?.data?.length}\` spot trade fill(s)`);
    return response;
  },
};
